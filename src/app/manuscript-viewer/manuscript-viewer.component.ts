import { AfterViewInit, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import tippy, { followCursor } from 'tippy.js'
import CETEI from "CETEIcean";
//@ts-ignore
import Mirador from 'mirador/dist/es/src/index';

@Inject(Element) 
@Component({
  selector: 'app-manuscript-viewer',
  templateUrl: './manuscript-viewer.component.html',
  styleUrl: './manuscript-viewer.component.scss'
})
export class ManuscriptViewerComponent implements OnInit, AfterViewInit, OnDestroy{
constructor(
  private http:HttpClient, 
  @Inject(DOCUMENT) document: Document,
  private element: ElementRef
  
){
  this.el = element.nativeElement;
}


value=""
el!:any
tooltip!:any;
allPages!:any[]
baseURL = environment.baseUrl
selectedPage:any = {"page":"12r", "name":""};
manifestId!:any;
CETEIcean!: any;
abortController!:any
totalLinecount!:any[]


ngOnInit(): void {
  this.getAllPages()
  this.getNumberOfLine(this.selectedPage["page"])
  let random_xml_url = `${this.baseURL}get_random_xml`;
  let random_manifest_url = `${this.baseURL}get_random_manifest`;
  this.http.get(random_xml_url, { headers: new HttpHeaders({ 'Content-Type': 'application/xml'}), responseType: 'text'}).subscribe(res => {
    this.value= res.replace(`xmlns=\"\"`, '')
    this.value= res
    
  });
  
  this.CETEIcean = new CETEI({
    ignoreFragmentId: true
  })


  this.miradorViewer(random_manifest_url)
  setTimeout(()=>{
    this.xml2html()
  }, 1000)
  
  

}

  ngAfterViewInit(): void{
    this.tooltip = tippy(this.el, {
      hideOnClick: false,
      trigger: 'manual',
      placement: 'top',
      followCursor: true,
      plugins: [followCursor],
      offset: [0, 15]
    })

    this.abortController = new AbortController();

    this.el.addEventListener('mouseover', (event) => {
      event.stopPropagation()
      const element = event.srcElement
      const result = this.process(element)

      if(result.show) {
        this.tooltip.setContent(result.data) 
        
        this.tooltip.show()
      }
    }, { signal: this.abortController.signal })

    this.el.addEventListener('mouseout', (event) => {
      event.stopPropagation()
      this.tooltip.hide()
    }, { signal: this.abortController.signal })
  }

  ngOnDestroy(): void {
    // this.abortController.abort
  }
  

  xml2html(){
    let teiNode = document.getElementById("tei")
    let ch = teiNode?.lastElementChild
    while (ch){
      teiNode?.removeChild(ch)
      ch = teiNode?.lastElementChild
    }
    
      let p = new Promise((resolve, reject) => {     
        this.CETEIcean.makeHTML5(this.value, res => {resolve(res); console.log(res);
          teiNode?.appendChild(res);
          let teiabNode = document.getElementsByTagName("tei-ab")
          Array.from(teiabNode).forEach((el)=>{
              let n = el.getAttribute("n")
              if (n!==null){
                let chapter = n.substring(n.indexOf("K")+1, n.indexOf("V"))
                let verse = n.substr(n.indexOf("V")+1)
                let span = document.createElement("span")
                span.innerText = chapter+":"+verse
                span.id = "chapter"
                // el.appendChild(span)
                el.prepend(span)
                
              }
          })
        })
      })
    

  }

  miradorViewer(manifest_url){
    Mirador.viewer({
      id: "mirador-viewer",
      windows: [
        {
          manifestId: manifest_url
        },
     
      ],
      thumbnailNavigation: {
        defaultPosition: "far-bottom"
      }
    });
  }

  getAllPages(){
      this.http.get<any>(`${this.baseURL}get_all_pages`).subscribe(res=>{
        this.allPages = res
      })
  }

  getNumberOfLine(name:any){
    this.http.get(`${this.baseURL}get_number_of_line?name=${name}.xml`).subscribe((res:any) => {
      console.table(res);
      this.totalLinecount = res.lines;

    });
  }
  

  onPageChange(event:any) {
    console.log('event :' + event);
    console.log(event.value.page);
    this.http.get(`${this.baseURL}get_xml?name=${event.value.page}.xml`, { headers: new HttpHeaders({ 'Content-Type': 'application/xml'}), responseType: 'text'}).subscribe(res => {
     
    this.value= res.replace(`xmlns=\"\"`, '')
      this.xml2html()
    });
    this.getNumberOfLine(event.value.page);
    let manifest = `${this.baseURL}get_manifest?name=${event.value.page}.json`
    console.log(manifest)
    this.miradorViewer(manifest)
    
}

  process(element) {
    const result = {
      show: false,
      data: ''
    }

    if (!element) { return result }

    const isUnclear = element.getAttribute('data-origname') === 'unclear'
    const isSupplied = element.getAttribute('data-origname') === 'supplied'
    const isApp = element.getAttribute('data-origname') === 'app'

    if(isUnclear) {
      const reason = element.getAttribute('reason')
      result.data = `unclear - ${reason}`
      result.show = true
    }

    if (isSupplied) {
      const reason = element.getAttribute('reason')
      const source = element.getAttribute('source')

      result.data = `supplied - ${source} - ${reason}`
      result.show = true
    }

    if(isApp) {
      let original = element.querySelector('[type="orig"]')
      let corrected = element.querySelector('[type="corr"]')
      
      original = original.textContent
      corrected = corrected.textContent

      result.data = `${original} -> ${corrected}`
      result.show = true
    }
    
    return result
  }


}
