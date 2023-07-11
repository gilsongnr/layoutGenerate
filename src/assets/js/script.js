"use strict";


const edtFileName = document.getElementById("file_name")
const labelfilename = document.getElementById("labelfilename")
edtFileName.onchange = ()=>{
  labelfilename.innerHTML = edtFileName.value
}

const classCtrlError = "is-invalid"

function setCtrlNoError(ctrl){
    ctrl.classList.remove(classCtrlError)  
}

function setCtrlInError(edt){
    const evtName = "change" 
    edt.classList.add(classCtrlError)
    edt.addEventListener(evtName, modifyText);
    function modifyText(){
        setCtrlNoError(edt)
        edt.removeEventListener(evtName, modifyText)
    }
}
function setCtrlValue(edt, value){
    edt.value = value
    setCtrlNoError(edt)                
}
function isValidName(name){
     return (name != undefined) && (name != "") && name.match(/^[A-Za-z_]+[\w_]*$/)
}
const colNames = {
    name: "name",
    tp  : "tp",
    pos: "pos", 
    size: "size", 
    dec: "dec", 
    literal: "literal", 
    check: "Check", 
    descr: "descr",
    list: ["name", "tp", "pos", "size", "dec", "literal", "Check", "descr"],
    titles: ["Nome", "Tipo", "Posição", "Tamanho", "Decimais", "Valor literal", "Check", "Descrição", ""]
}
function checkText(s){
      return (s != undefined) && (s.trim() != "")
}
const columnEditor = {
  form   : new bootstrap.Modal(document.getElementById('edt_colModal'), {}),
  getCtrl: function (colName){return document.getElementById("edt_col_" + colName)},
  validateCtrls: function(){
                          let erros = 0;
                          const obj = this
                          function setError(edt){
                              erros++;
                              setCtrlInError(edt)
                          }
                          function check(edt){
                                        if (checkText(edt.value)) {
                                          return true
                                        }
                                        setError(edt)
                                        return false  
                                    }
                          
                          if (!isValidName(this.edtCtrlName.value)){
                                setError(this.edtCtrlName)
                          }
                          
                          if (check(this.edtCtrlTp)){
                              if (this.edtCtrlTp.value == "E")
                              check(this.getCtrl(colNames.check))
                          }
                          return erros
                    },
  formExecute: function(then){
                          this.editsChanged()
                          const obj = this
                          function saveClick(evt){
                              if (obj.validateCtrls() == 0){
                                    then()
                                    obj.form.hide()                              
                              }
                          }
                          this.getCtrl("btn_save").onclick = saveClick
                          this.form.show()
                    },                                  
  addRow : function(table){    
                  for (let i = 0; i < 8; i++) {setCtrlValue(this.getCtrl(colNames.list[i]), "")} 
                  if (table.rows.length > 1){
                      const lastRow = table.rows[table.rows.length - 1]
                      this.getCtrl(colNames.pos).value = parseInt(lastRow.cells[2].textContent) + parseInt(lastRow.cells[3].textContent)
                  }
                  this.formExecute(()=>{
                      tableColsAddRow(table, this.edtCtrlName.value, this.edtCtrlTp.value, this.getCtrl(colNames.pos).value, this.getCtrl(colNames.size).value, 
                                              this.getCtrl(colNames.dec).value, this.getCtrl(colNames.literal).value, this.getCtrl(colNames.check).value, this.getCtrl(colNames.dec).value)
                       
                  })
              },
  edit: function(cells){
                  const ctrls = []  
                  for (let i = 0; i < 6; i++) {
                      const ctrl = this.getCtrl(colNames.list[i])
                      setCtrlValue(ctrl, getCellA(cells[i]))
                      ctrls.push(ctrl)
                  }  
                  const edtCheck = this.getCtrl("Check")
                  const edtDescr = this.getCtrl("descr")
                  setCtrlValue(edtCheck, getCellB(cells[6]))
                  setCtrlValue(edtDescr, getCellB(cells[7]))
                  this.formExecute(()=>{ 
                      for (let i = 0; i < ctrls.length; i++) {
                        setCellA(ctrls[i].value, cells[i])
                      }   
                      setCellB(edtCheck.value, cells[6])
                      setCellB(edtDescr.value, cells[7])
                  })
        },
  tpChanged: function(){this.edtCtrlDec.disabled = this.edtCtrlTp.value != "N" }, 
  editsChanged: function (){
    this.tpChanged()
  },
  init: function(){
        this.edtCtrlName = this.getCtrl("name")
        this.edtCtrlTp = this.getCtrl("tp")
        this.edtCtrlDec = this.getCtrl("dec")        
        this.edtCtrlTp.onchange = ()=>{tpChanged()}
      }

}
columnEditor.init()

const setCellA = (s, cel)=>{cel.textContent = s}
const setCellB = (s, cel)=>{cel.innerHTML = s.replaceAll("\n", "<br>")}

const getCellA = (cel)=>{return cel.textContent}
const getCellB = (cel)=>{return cel.innerHTML.replaceAll("<br>", "\n")}

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
function createInputText(id, placeholder, required){return createInput(id, placeholder, required, "text")} 
function createInputNumber(id, placeholder, required){return createInput(id, placeholder, required, "number")} 

const accordionFile = document.getElementById("accordionFile");
const collapseFile = document.getElementById("collapseFile")
let lineCount = 0

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
         
          let div = dbodyA.appendChild(createDivClass("col"))
          let h5 = div.appendChild(document.createElement("h5"))
          h5.classList = "text-center"
          h5.innerHTML = "Colunas"
          div = div.appendChild(createDivClass("table-container"))
          div.style.overflow = "scroll"
          this.tableCols = div.appendChild(document.createElement("table"))
          this.tableCols.classList = "table table-striped table-bordered"
          let tr = this.tableCols.appendChild(document.createElement('tr'));
          colNames.titles.forEach(i => {tr.appendChild(document.createElement("th")).innerHTML = i});        
          btnAddCol.onclick = ()=>{columnEditor.addRow(this.tableCols)}
        }
    }
    obj.init();   
    return obj;
}

function createButtonSvg(svgClass){
  const i = document.createElement("i")
  i.classList = svgClass
  i.style.fontSize = "1rem"
  i.style.color = "#0d6efd"
  return i
}

function tableColsAddRow(table,  name, tp, pos, size, dec, lit, check, desc){
  let row = table.insertRow()
  function add(value, proc){
      let cell = row.insertCell()
      if (value != undefined) {
        proc(value, cell)
      }
      return cell
  }
  function addA(value){return add(value, setCellA)}
  let colName = addA(name)
  colName.style.textAlign = "left"
  //col.style.color = "#0d6efd"
  colName.style.cursor = "pointer"
  colName.classList.add("hover-green")
  colName.onclick =  ()=>{columnEditor.edit(row.cells)}  

  addA(tp) 
  addA(pos) 
  addA(size) 
  addA(dec) 
  addA(lit) 
  add(check, setCellB).style.textAlign = "left"
  add(desc, setCellB).style.textAlign = "justify"
  row.insertCell().appendChild(createButtonSvg("bi bi-pencil-square hover-green")).onclick = colName.onclick
  row.insertCell().appendChild(createButtonSvg("bi bi-trash3 hover-red")).onclick = ()=>{
    if (confirm("Excluir coluna: " + row.cells[0].textContent)){
      table.deleteRow(row.rowIndex);
    }
  }
  return row;
}

function addLine(lineCode, show){
  const obj = createLine(lineCode, show)    
  accordionFile.appendChild(obj.line);  
  document.getElementById("btnLoad").disabled = true
  return obj
}
function addLineDlg(){
    collapseAll(accordionFile)
    let line = accordionFile.querySelector('.accordion-button.line-header');
    let code
    while(true){
        code = prompt("Informe o código da linha", "")
        if (code==null) return
        code = code.trim()
        if (code == "") {
          alert("Código de linha não pode ser branco")
          continue
        }
        if (line){
          if (line.obj.code.length != code.length){
            alert("Códigos de linhas devem ser todos de tamanhos iguais")
            continue            
          }
        }
        break      
    }
    
    addLine(code, true)    
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
     
function getCols(obj){
  let rows = obj.tableCols.rows;
  let x = rows.length;
  const cols = []

  for (let i = 1; i < rows.length; i++) {
    const colValues = []
    function add(cell){
      colValues.push(cell.textContent)
    }
    const r = rows[i].cells;
     for (let x = 0; x < 6; x++) {
       add(r[x])
     }
     colValues.push(getCellB(r[6]))
     for (let x = 7; x < 11; x++) {
         colValues.push("")
     }
     colValues.push(getCellB(r[7]))
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
    let erros = 0;
    function setError(edt){
        erros++;
        setCtrlInError(edt)
    }
    function check(edt){
                  if (checkText(edt.value)) {
                    return true
                  }
                  setError(edt)
                  return false  
              }

    const edtMeta_name = document.getElementById("meta_name")
    const edt_table_name_prefix =  document.getElementById("file_table_name_prefix")
    const file_desc = document.getElementById("file_desc")
    
    if (!isValidName(edtMeta_name.value)){
          setError(edtMeta_name)
    }
    if (!isValidName(edtMeta_name.value)){
          setError(edt_table_name_prefix)
    }

    //check(edtMeta_name)
    check(edtFileName)
    check(edt_table_name_prefix)
    check(file_desc)
    
    if (erros == 0){
      then()
      obj.form.hide()                              
    }

  let lineHeaderCode = "0000"

    let lines = getLines()     
    if (lines.length < 1){
      alert("Nenhuma linha informada")
      return
    }


  const fileName = edtMeta_name.value
  const lfile = [
        edtMeta_name.value, 
        document.getElementById("file_versao").value, 
        document.getElementById("file_line_code_pos").value, 
        lineHeaderCode,
        document.getElementById("file_col_separator").value, 
        fileName, 
        document.getElementById("file_natural_keys").value, 
        document.getElementById("file_date_mask").value, 
        document.getElementById("file_version_col_name").value, 
        edt_table_name_prefix.value, 
        file_desc.value
    ]


  let csvContent = "data:text/csv;charset=utf-8,F" + joinList(lfile) + "\n"
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
function load(content){
  let lines = content.split('\n');
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
             load(event.target.result)
         };
         reader.readAsText(file, "windows-1252");
  }
};

function loadFromFile(){
  inputFile.click()
}
function loadExample(){
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {load(this.responseText)}
  xhttp.open("GET", "examples/layout - declan.csv");
  xhttp.send();
}