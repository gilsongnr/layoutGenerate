
const prefixError = "ERROR="

function joinList(list){
    let r = ""
  list.forEach(i => {
    if (i==undefined || i == ""){
      i = '""'
    } else {
      i = '"' + i + '"'
    }
    r += ";" + i;
  });
  return r
}

function createElementClass(tp, classList){
  const e = document.createElement(tp)
  e.classList = classList
  return e
}
function createButton(classList){
  const btn = createElementClass("button", classList)
  btn.type = "button"
  return btn
}
function createDiv(){
  return document.createElement("div")
}
function createDivClass(classList){
  let div = createDiv()
  div.classList = classList
  return div
}
function createDivClasses(classList){
let div = createDiv()
classList.forEach(s => {
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
    if (classList == undefined){
      classList = "form-control"
    }
    let input = createElementClass("input", classList)
    if (inputType != undefined){
      input.type = inputType
    }
    if (placeholder != undefined){
      input.placeholder = placeholder
    }
    if (id != undefined){
      input.id=id
    }
    
    if (required != undefined){
      input.required = required
    }
    return input
} 
function createInputText(id, placeholder, required){return createInput(id, placeholder, required, "text")} 
function createInputNumber(id, placeholder, required){return createInput(id, placeholder, required, "number")} 
function createInputTextArea(id, rows){
    const a = createElementClass("textarea", "form-control")
    a.id = id  
    a.rows = rows
    return a
} 

const classCtrlError = "is-invalid"

function setCtrlNoError(ctrl){
    ctrl.classList.remove(classCtrlError)  
}

function setCtrlInError(edt, error){
    const evtName = "change" 
    edt.classList.add(classCtrlError)
    edt.addEventListener(evtName, modifyText);
    function modifyText(){
        setCtrlNoError(edt)
        edt.removeEventListener(evtName, modifyText)
    }
    //if (error != undefined){
    //  edt.setCustomValidity(error)
    //}
}
function setCtrlValue(edt, value){
    edt.value = value
    setCtrlNoError(edt)                
}
function isValidName(name, required){
     if (name == undefined || name == ""){
        if (required == false) return true
     }
     return name.match(/^[A-Za-z_]+[\w_]*$/)
}

function isSetText(s){
      return (s != undefined) && (s.trim() != "")
}

function checkText(s){
      return isSetText(s)
}

const setCellA = (s, cel)=>{cel.textContent = s}
const setCellB = (s, cel)=>{cel.innerHTML = s.replaceAll("\n", "<br>")}

const getCellA = (cel)=>{return cel.textContent}
const getCellB = (cel)=>{return cel.innerHTML.replaceAll("<br>", "\n")}

function createButtonSvg(svgClass){
  const i = document.createElement("i")
  i.classList = svgClass
  i.style.fontSize = "1rem"
  i.style.color = "#0d6efd"
  i.style.cursor = "pointer"
  return i
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
function tableColsAddRow(table,  name, tp, pos, size, dec, lit, check, desc){
  if (tp == "C") tp = "A"
  let row = table.insertRow()
  function add(value, proc, align){
      let cell = row.insertCell()
      if (align != undefined){cell.style.textAlign = align}
      if (value != undefined) {proc(value, cell)}      
      return cell
  }
  function addA(value, align){return add(value, setCellA, align)}
  let col = addA(name, "left")
  col.style.cursor = "pointer"
  col.classList.add("hover-green")
  col.onclick =  ()=>{columnEditor.edit(row.cells)}  

  addA(tp)
  addA(pos) 
  addA(size) 
  addA(dec) 
  addA(lit) 
  add(check, setCellB, "left")
  add(desc, setCellB, "justify")
  row.insertCell().appendChild(createButtonSvg("bi bi-pencil-square hover-green")).onclick = col.onclick
  row.insertCell().appendChild(createButtonSvg("bi bi-trash3 hover-red")).onclick = ()=>{
    if (confirm("Excluir coluna: " + row.cells[0].textContent)){
      table.deleteRow(row.rowIndex);
    }
  }
  return row;
}

function loadRemote(){  
  panelwait01.style.display = "flex"
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function(result) {
    try {
      doloadRemote(JSON.parse(this.responseText));
    } finally {
      panelwait01.style.display = "none"
    }    
  }
  xhttp.open("GET", "list");
  xhttp.send();
}

function doloadRemote(list){
  const modal = document.getElementById('listCadModal')
  const mbody = modal.querySelector(".modal-body");
  mbody.innerHTML = ""
  
  const form = new bootstrap.Modal(modal, {})

  const cellClick = (metaName, version)=>{  
    panelwait01.style.display = "flex"  
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(result) {
      load(fileForm, this.responseText);
      form.hide()
      panelwait01.style.display = "none"
    }
    xhttp.open("GET", "load?file_name="+metaName+"&version="+version);
    xhttp.send();
  }

  list.forEach(i => {
    const panelCard = createDivClass("card card bg-secondary text-white mt-3")
    mbody.appendChild(panelCard)
    const item = panelCard.appendChild(createDivClass("card-body"))
    item.appendChild(createElementClass("p", "card-text")).innerHTML = i.descr 
    if (i.versions.length > 1){
      i.versions.forEach(v => {
          const a = item.appendChild(createElementClass("a", "card-link"))
          a.href = "#"
          a.innerHTML = v;
          a.onclick = ()=>{cellClick(i.name, v)     
        }
      })
    } else {
      item.style.cursor = "pointer"
      if (i.versions.length == 1){
        item.onclick = ()=>{cellClick(i.name, i.versions[0])}
      } else {
        item.onclick = ()=>{cellClick(i.name, null)}
      }
     }
  });        
  form.show()
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
                              if (this.edtCtrlTp.value == "E"){
                                  const edt = this.getCtrl(colNames.check)
                                  if (check(edt)){
                                      const list = edt.value.split("\n")
                                      if (list.length < 2){
                                        setError(edt)
                                      }
                                      const keys = []                                      
                                      for (let i = 0; i < list.length; i++) {
                                        const s = list[i];
                                        let p = s.indexOf("=")
                                        if ((p < 1) || (p >= s.length - 1)){
                                          setError(edt)
                                          break
                                        }                 
                                        const v = s.substring(0, p)
                                        if (keys.includes(v)){
                                          setError(edt)
                                          break
                                        }
                                        keys.push(v)
                                      }
                                  }
                              }
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
        this.edtCtrlTp.onchange = ()=>{this.tpChanged()}
      }

}
columnEditor.init()