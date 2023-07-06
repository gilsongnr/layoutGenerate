"use strict";


const edtFileName = document.getElementById("file_name")
const labelfilename = document.getElementById("labelfilename")
edtFileName.onchange = ()=>{
  labelfilename.innerHTML = edtFileName.value
}
function createDiv(){
    return document.createElement("div")
}
function createDivClass(classList){
    let div = createDiv()
    div.classList = classList
    return div
}
function createDivClasses(classeList){
  let div = createDiv()
  classeList.forEach(s => {
    div.classList.add(s)
  });
  return div
}
function createDivCtrl(classList, input, title){
      if (title == undefined){
        title = input.placeholder
      }
      let div = createDivClass(classList)
      let label = div.appendChild(document.createElement("label"))
      label.setAttribute("for", input.id)
      label.innerHTML = title
      div.appendChild(input)
      return div
}
function createDivGroup(classList, input, title){
  return createDivCtrl("form-group " + classList, input, title) 
}

function createInput(id, placeholder, required, inputType, classList){
      let input = document.createElement("input")
      if (inputType != undefined){
        input.type = inputType
      }
      if (classList == undefined){
        classList = "form-control"
      }
      input.classList = classList
      if (placeholder != undefined){
        input.placeholder = placeholder
      }
      input.id=id
      
      if (required != undefined){
        input.required = required
      }
      return input
} 
function createInputText(id, placeholder, required){
      return createInput(id, placeholder, required, "text")
} 
function createInputNumber(id, placeholder, required){
      return createInput(id, placeholder, required, "number")
} 



const accordionFile = document.getElementById("accordionFile");
const collapseFile = document.getElementById("collapseFile")
let lineCount = 0
const colNames = ["Nome", "Tipo", "Posição", "Tamanho", "Decimais", "Valor literal", "Check", "Descrição"]

function createLine(lineCode, show){ 
    const obj = {
      id: ++lineCount,
      code: lineCode,
        doSetIsHeader:  function(){
          const className = "line-is-hearder"
          if (this.line_header.checked){
            this.btnheader.classList.add(className)
          }else{
            this.btnheader.classList.remove(className)  
          }
        },
        setIsHeader:  function(value){
          this.line_header.checked = value
          this.doSetIsHeader()
        },
        init: function(){
          const lineID = "line-" + this.id
          const collapseCtrlID = "collapse-" + this.id
          const collapseClass = "collapse"

          this.line = createDivClass("accordion-item")
              
          let ctrl = this.line.appendChild(document.createElement("h2"))
          ctrl.classList = "accordion-header"
          ctrl.id = lineID
          this.btnheader = ctrl.appendChild(document.createElement("button"))
          this.btnheader.classList = "accordion-button collapsed line-header"
          this.btnheader.type = "button"
          this.btnheader.setAttribute("data-bs-toggle", collapseClass)
          this.btnheader.setAttribute("data-bs-target", "#"+collapseCtrlID)
          this.btnheader.setAttribute("aria-expanded", "false")
          this.btnheader.setAttribute("aria-controls", collapseCtrlID)
          //this.btnheader.setAttribute("contenteditable", "true")
          this.btnheader.innerHTML = "Linha: " + lineCode
          this.btnheader.obj = this

          const collapseCtrl = this.line.appendChild(createDivClasses(["accordion-collapse", collapseClass]))
          collapseCtrl.id = collapseCtrlID
          if (show){
            collapseCtrl.classList.add("show")
          }
          collapseCtrl.setAttribute("aria-labelledby", lineID)
          collapseCtrl.setAttribute("data-bs-parent", "#accordionFile")
          const dbody = collapseCtrl.appendChild(createDivClass("accordion-body"))
          let dbodyA = dbody.appendChild(createDivClass("row"))
          let col = dbodyA.appendChild(createDivClass("col"))

          this.line_header = createInput("line_header" + this.id, "", false, "checkbox", "form-check-input")                    
          col.appendChild(createDivCtrl("form-check", this.line_header, "Essa linha é cabeçalho"))
          
          this.line_header.onclick = ()=>{
            if (this.line_header.checked){
              let a = accordionFile.querySelectorAll('.accordion-button.line-header');
              for (let i = 0; i < a.length; i++) {
                  let b = a[i].obj
                  if (b != this){
                    b.setIsHeader(false)
                  }
              }        
            }
            this.doSetIsHeader()
          }
          col = dbodyA.appendChild(createDivClass("col-auto"))
          const btnAddCol = col.appendChild(document.createElement("button"))
          btnAddCol.classList = "btn btn-info me-1"
          btnAddCol.innerHTML = "Add Coluna"
          btnAddCol.type = "button"

          ctrl = col.appendChild(document.createElement("button"))
          ctrl.classList = "btn btn-danger"
          ctrl.innerHTML = "Excluir linha"
          ctrl.type = "button"
          ctrl.onclick = ()=>{
            if (confirm("Excluir linha: " + lineCode)){
              this.line.remove()
            }
          }
          
          dbodyA = dbody.appendChild(createDivClass("row"))
          this.line_level = createInputNumber("line_level" + this.id)
          dbodyA.appendChild(createDivGroup("col-4 col-sm-3 col-md-3", this.line_level, "Nível"))
       
          this.line_parente = createInputText("line_parente" + this.id)
          dbodyA.appendChild(createDivGroup("col-4 col-sm-3 col-md-3", this.line_parente, "Linha pai"))

          this.table_sulfix = createInputText("table_sulfix" + this.id, "Prefixo do nome da tabela")
          dbodyA.appendChild(createDivGroup("col-12 col-md-6", this.table_sulfix, "Nome no banco"))
          
          
          this.line_descr = document.createElement("textarea")
          this.line_descr.classList = "form-control"
          this.line_descr.rows = 6
          this.line_descr.id = "line_descr" + this.id
          dbodyA.appendChild(createDivGroup("col-12", this.line_descr, "Descrição da Linha"))
         
          let div = dbodyA.appendChild(createDivClass("table-container text-center"))
          let h5 = div.appendChild(document.createElement("h5"))
          h5.innerHTML = "Colunas"
          this.tableCols = div.appendChild(document.createElement("table"))
          this.tableCols.classList = "table table-success table-striped table-bordered"
          let tr = this.tableCols.appendChild(document.createElement('tr'));

          colNames.forEach(i => {
              tr.appendChild(document.createElement("th")).innerHTML = i            
          });
        
          btnAddCol.onclick = ()=>{
            tableColsAddRow(this.tableCols, "Col_" + this.tableCols.rows.length, "A", this.tableCols.rows.length + 1, "", "", "", "Coluna xx")                      
          }
        }
    }
    obj.init();   
    return obj;
}

const iconDelete = 
`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>
`

// `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105.16 122.88"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><title>delete</title><path class="cls-1" d="M11.17,37.16H94.65a8.4,8.4,0,0,1,2,.16,5.93,5.93,0,0,1,2.88,1.56,5.43,5.43,0,0,1,1.64,3.34,7.65,7.65,0,0,1-.06,1.44L94,117.31v0l0,.13,0,.28v0a7.06,7.06,0,0,1-.2.9v0l0,.06v0a5.89,5.89,0,0,1-5.47,4.07H17.32a6.17,6.17,0,0,1-1.25-.19,6.17,6.17,0,0,1-1.16-.48h0a6.18,6.18,0,0,1-3.08-4.88l-7-73.49a7.69,7.69,0,0,1-.06-1.66,5.37,5.37,0,0,1,1.63-3.29,6,6,0,0,1,3-1.58,8.94,8.94,0,0,1,1.79-.13ZM5.65,8.8H37.12V6h0a2.44,2.44,0,0,1,0-.27,6,6,0,0,1,1.76-4h0A6,6,0,0,1,43.09,0H62.46l.3,0a6,6,0,0,1,5.7,6V6h0V8.8h32l.39,0a4.7,4.7,0,0,1,4.31,4.43c0,.18,0,.32,0,.5v9.86a2.59,2.59,0,0,1-2.59,2.59H2.59A2.59,2.59,0,0,1,0,23.62V13.53H0a1.56,1.56,0,0,1,0-.31v0A4.72,4.72,0,0,1,3.88,8.88,10.4,10.4,0,0,1,5.65,8.8Zm42.1,52.7a4.77,4.77,0,0,1,9.49,0v37a4.77,4.77,0,0,1-9.49,0v-37Zm23.73-.2a4.58,4.58,0,0,1,5-4.06,4.47,4.47,0,0,1,4.51,4.46l-2,37a4.57,4.57,0,0,1-5,4.06,4.47,4.47,0,0,1-4.51-4.46l2-37ZM25,61.7a4.46,4.46,0,0,1,4.5-4.46,4.58,4.58,0,0,1,5,4.06l2,37a4.47,4.47,0,0,1-4.51,4.46,4.57,4.57,0,0,1-5-4.06l-2-37Z"/></svg>
// `
function createButtonDelete(){
  const div = createDiv()
  div.innerHTML = iconDelete
  div.style.cursor = "pointer"
  return div
}
function createInputTextArea(){
  const div = document.createElement("textarea")
  return div
}

function tableColsAddRow(table,  name, tp, pos, size, dec, lit, check, desc){
  let row = table.insertRow();
  const get1 = (s, cel)=>{cel.textContent = s}
  const get2 = (s, cel)=>{cel.innerHTML = s.replaceAll("\n", "<br>")}
  function add(value, proc){
    let cell = row.insertCell();
    if (value != undefined) {
      proc(value, cell)
    }
    return cell
  }
  function add1(value){
    return add(value, get1)
  }
  function add2(value){
    return add(value, get2)
  }
  add1(name).style.textAlign = "left"
  add1(tp) 
  add1(pos) 
  add1(size) 
  add1(dec) 
  add1(lit) 
  //add().appendChild(createInputTextArea()).value = check 
  //add().appendChild(createInputTextArea()).value = desc
  add2(check).style.textAlign = "left"
  add2(desc).style.textAlign = "justify"
  //add("x")
  row.insertCell().appendChild(createButtonDelete()).onclick = ()=>{
    if (confirm("Excluir coluna: " + row.cells[0].textContent)){
      table.deleteRow(row.rowIndex);
    }
  }
  //row.setAttribute("contenteditable", "true")
  return row;
}

function addLine(lineCode, show){
  const obj = createLine(lineCode, show)    
  accordionFile.appendChild(obj.line);  
  document.getElementById("btnLoad").disabled = true
  return obj
}
function addLineDlg(){
    let lineCode = prompt("Infrme o código da linha", "");

    if (lineCode != null) {
      collapseAllAccordionFile() 
      addLine(lineCode, true)    
    }
}

function collapseAll(accordionFile) {
    let a = accordionFile.querySelectorAll('.accordion-collapse.show');
    for (let i = 0; i < a.length; i++) {
          let b = a[i]
          if (b.id != "collapseFile"){
            b.classList.remove('show')
          }
    }
  }
     
function collapseAllAccordionFile() {
    collapseAll(accordionFile)
}
function getCols(obj){
  let rows = obj.tableCols.rows;
  let x = rows.length;
  const cols = []

  for (let i = 1; i < rows.length; i++) {
    const colValues = []
    function add(cell){
      colValues.push(cell.textContent)//innerHTML.replaceAll("<br>", "\n"))
    }
    const r = rows[i].cells;
     for (let x = 0; x < 6; x++) {
       add(r[x])
     }
     //console.log(r[0].textContent)
     //let txt = r[6].querySelector("textarea")//-- r[7].getElementById 
     //console.log(txt)
     //console.log(txt.value)
     //console.log(r[6].childNodes[0])
     //add(txt.value)
     //add()
     colValues.push(r[6].innerHTML.replaceAll("<br>", "\n"))
     for (let x = 7; x < 11; x++) {
         colValues.push("")
     }
     //txt = r[7].querySelector("textarea")//-- r[7].getElementById 
     //console.log("r[7]")
     //console.log(txt)
     //console.log(txt.value)
     //add(txt.value)
     colValues.push(r[7].innerHTML.replaceAll("<br>", "\n"))
     cols.push(colValues)    
  } 
  return cols
}
function getLine(obj){
  return {values: [obj.code, "", obj.line_level.value, "", "", obj.line_parente.value, 
                    "", "", "", "", obj.table_sulfix.value, obj.line_descr.value], cols: getCols(obj)};  
}
function getLines(){
  let a = accordionFile.querySelectorAll('.accordion-button.line-header');
  let lines = []
    for (let i = 0; i < a.length; i++) {
        lines.push(getLine(a[i].obj))
    }   
    return lines
}

function joinList(list){
    let r = ""
  list.forEach(i => {
    if (i=="undefined" || i == ""){
      i = ""
    } else {
      i = '"' + i + '"'
    }
    r += ";" + i;
  });
  return r
}

function saveToFile(){
  let lineHeaderCode = "0000"
  const fileName = document.getElementById("meta_name").value
  const lfile = [
        fileName, 
        document.getElementById("file_versao").value, 
        document.getElementById("file_line_code_pos").value, 
        lineHeaderCode,
        document.getElementById("file_col_separator").value, 
        edtFileName.value, 
        document.getElementById("file_natural_keys").value, 
        document.getElementById("file_date_mask").value, 
        document.getElementById("file_version_col_name").value, 
        document.getElementById("file_table_name_prefix").value, 
        document.getElementById("file_desc").value
    ]
    let csvContent = "data:text/csv;charset=utf-8,F" + joinList(lfile) + "\n"
    let lines = getLines()     
  
  lines.forEach(line => {
    csvContent += "L" + joinList(line.values) + "\n"
    line.cols.forEach(col => {
      csvContent += "C" + joinList(col) + "\n"
    })
  });
  
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  const csvFileName = "layout - " + fileName + ".csv";
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", csvFileName);
  document.body.appendChild(link);
  link.click();
}

const inputFile = document.createElement("input")
inputFile.type = "file"
inputFile.accept = "text/csv"

inputFile.onchange = function () {
  let files = this.files;               
  if (files && files.length) {
     let file = files[0];
  
     if (file.size > 3 * 1024 * 1024){
        alert('Ficheiro demasiado grande')
        return
     }
         let reader = new FileReader();
         reader.onload = function(event){
             let lines = event.target.result.split('\n');
             if (lines.length < 1) return;
             lineSpliter.reset(lines)
             let cols = lineSpliter.next()
             if (cols[0] != "F"){
              alert("Arquivo não é válido")
              return
             }
             document.getElementById("meta_name").value = cols[1]
                    document.getElementById("file_versao").value = cols[2] 
                    document.getElementById("file_line_code_pos").value  = cols[3] 
                   let lineHeaderCode = cols[4]
                   document.getElementById("file_col_separator").value = cols[6]
                   edtFileName.value  = cols[7]
                   document.getElementById("file_natural_keys").value = cols[8]
                   document.getElementById("file_date_mask").value = cols[9]
                   document.getElementById("file_version_col_name").value = cols[10]
                   document.getElementById("file_table_name_prefix").value = cols[11]
                   document.getElementById("file_desc").value = cols[12]
                   labelfilename.innerHTML = edtFileName.value

              let lineObj
              while (true){                
                cols = lineSpliter.next()
                if (cols.length == 0){
                  break
                }
                switch (cols[0]) {
                  case "L": 
                      lineObj = addLine(cols[1], false)
                    
                      if (lineHeaderCode == lineObj.code){
                        lineObj.setIsHeader(true)
                      }
                      lineObj.line_level.value = cols[3]
                      lineObj.line_parente.value = cols[6]
                      lineObj.table_sulfix.value = cols[11]
                      lineObj.line_descr.value = cols[12]
                      break
                  case "C": 
                      tableColsAddRow(lineObj.tableCols, cols[1], cols[2], cols[3], cols[4], cols[5], cols[6], cols[7])
                      break
                  default:
                    console.log(cols)
                }
              }
         };
         reader.readAsText(file, "windows-1252");
  }
};

function loadFromFile(){
  inputFile.click()
}
// loadTest()

// function loadTest(){
//   addLine("AAAA")
//   //addLine("2000")
  
// const defs = ["meta_name", 
//               //"file_versao", 
//               //"file_line_code_pos", 
//               "meta_name", 
//               "file_versao", 
//               //"file_line_code_pos", 
//               //"file_col_separator", 
//               "file_name", 
//               "file_natural_keys", 
//               //"file_date_mask", 
//               //"file_version_col_name", 
//               "file_table_name_prefix"
//             ] 
// defs.forEach(i => {document.getElementById(i).value = i});  

// document.getElementById("file_desc").value = `O arquivo é composto de:
// -Um único registro do tipo 1 (Identificação do Arquivo)
// -Um ou mais registros do tipo 2 (Município)
// -Um ou mais registros do tipo 3 (DECLAN) para cada registro do tipo 2 (Município)
// -Um ou dois registros do tipo 4 (Ajustes e Distribuições) para cada registro do tipo 3 (DECLAN)
// -Um registro do tipo 5 (Receita) para cada registro do tipo 3 (DECLAN)
// -Um registro do tipo 6 (Contato) para cada registro do tipo 3 (DECLAN)
// `
// }