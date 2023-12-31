"use strict";

const pane01 = document.getElementById("pane01")

const panelwait01 = document.getElementById("panelwait01")
panelwait01.style.display = "none"
// document.body.onbeforeunload = ()=>{
//   console.log("document.onbeforeunload")
// }
const fileForm = {
  UL: pane01.appendChild(createElementClass("ul", "list-group")),
  appendInput: function (id, title, classList){    
    const a = createInputText(id, "")
    this.panel.appendChild(createDivGroup(classList, a, title)) 
    return a
  },
  init: function(){     
    this.panel02 = document.body.appendChild(createDivClass("modal fade"))
    this.panel02.setAttribute("tabindex", -1)
    let div = this.panel02.appendChild(createDivClass("modal-dialog modal-fullscreen")).appendChild(createDivClass("modal-content"))
    let header = div.appendChild(createDivClass("modal-header"))
    header.appendChild(createElementClass("h1", "modal-title fs-5")).innerHTML = "Dados do arquivo"
    let btn = header.appendChild(createButton("btn-close"))
    btn.setAttribute("data-bs-dismiss", "modal")
    btn.setAttribute("aria-label", "Close")

    this.panel = div.appendChild(createDivClass("modal-body"))

    let footer = div.appendChild(createDivClass("modal-footer"))
    btn = footer.appendChild(createButton("btn btn-secondary"))
    btn.setAttribute("data-bs-dismiss", "modal")
    btn.innerHTML = "Cancelar"
    
    this.btn_save = footer.appendChild(createButton("btn btn-primary"))
    this.btn_save.innerHTML = "Salvar"   
     this.edtName      = this.appendInput("a1", "Nome do layout", "col-12") 
    this.edtName.required = true
    this.edtMeta_name = this.appendInput("a2", "Identificação", "col-5 col-lg-5 col-sm-8 col-md-7")
    this.edtVersion   = this.appendInput("a3", "Versão", "col-4 col-lg-2 col-sm-4 col-md-2")
    this.edtTable_name_prefix = this.appendInput("a4", "Nome no banco", "col-5 col-sm-8 col-md-3")

    this.edtline_code_pos = createInputNumber("a5")
    this.panel.appendChild(createDivGroup("col-4 col-lg-2 col-sm-4 col-md-3", this.edtline_code_pos, "Pos Cód Linha")) 
    this.edtline_code_pos.value="1"

    this.edtnatural_keys = this.appendInput("a6", "Chave natural", "col-7 col-lg-4 col-sm-8 col-md-9")
    this.edtcol_separator = this.appendInput("a7", "Separador", "col-5 col-lg-2 col-sm-4 col-md-2")
    this.edtcol_separator.value="|" 

    this.edtversion_col_name = this.appendInput("a8", "Coluna Versão", "col-7 col-7 col-lg-2 col-sm-8 col-md-6")

    this.edtdate_mask = this.appendInput("a9", "Máscara de Data", "col-5 col-sm-4 col-md-4")
    
    this.edtdescr = createInputTextArea("a10", 1)
    this.panel.appendChild(createDivGroup("col-12", this.edtdescr, "Descrição do Arquivo")) 
    // this.lbfile_name = document.getElementById("lbfile_name")
    // this.edtName.onchange = this.edtNameChange


    const _this = this
    loader.onloadF = function(metaName, version, line_code_pos, lineHeaderCode, lineTraillerCode, col_separator, name, natural_keys, date_mask, version_col_name, table_name_prefix, descr){
                        _this.clear() 
                        setCtrlValue(_this.edtMeta_name, metaName);
                        setCtrlValue(_this.edtVersion, version);
                        setCtrlValue(_this.edtline_code_pos, line_code_pos);
                        setCtrlValue(_this.edtcol_separator, col_separator);
                        setCtrlValue(_this.edtName, name)
                        setCtrlValue(_this.edtnatural_keys, natural_keys);
                        setCtrlValue(_this.edtdate_mask, date_mask);
                        setCtrlValue(_this.edtversion_col_name, version_col_name);
                        setCtrlValue(_this.edtTable_name_prefix, table_name_prefix);
                        setCtrlValue(_this.edtdescr, descr);
                        
                        _this.lineHeaderCode = lineHeaderCode
                        _this.line_trailler_code = lineTraillerCode
                        document.getElementById("pane01-title").innerHTML = name
                      } 
    let lineObj
    loader.onloadline = function(lineCode, line_level, line_parente, table_sulfix, line_descr){
                              lineObj = createLine(lineCode) 
                              
                              if (_this.lineHeaderCode == lineObj.code){
                                lineObj.setIsHeader(true)
                              }
                              //lineObj.level        = cols[3]
                              lineObj.parentCode   = line_parente
                              lineObj.table_sulfix = table_sulfix
                              lineObj.descr        = line_descr
                              _this.addLine(lineObj) 
                      } 
    loader.onloadCol= function(colName, tp, pos, size, dec, lit, check, desc){
        lineObj.cols.push({name: colName,
          tp: tp,
          pos: pos,
          size: size,
          dec: dec,
          lit: lit,
          check: check,
          desc: desc}
        )
    } 
  },
  // edtNameChange: function(){
  //   this.lbfile_name.innerHTML = this.edtName.value
  // },
  lines: [],  
  linesGet: function (lineCode){
    for (let i = 0; i <  this.lines.length; i++)  {
      const line = this.lines[i].get(lineCode);
      if (line){return line}      
    }
  },
  addLine: function (lineObj){
    if (isSetText(lineObj.parentCode)) {
       const p = this.linesGet(lineObj.parentCode)
       if(p){
         p.lineAdd(lineObj)
         return
       }
    }
    this.UL.appendChild(lineObj.line)
    this.lines.push(lineObj)
    lineObj.level = 0
  },
  clear: function(){
    this.UL.innerHTML = ""
    this.lines = []
  }
}

fileForm.init()



//const edt_lineModal = document.getElementById('edt_lineModal')

const lineEditor = {
  //form   : new bootstrap.Modal(edt_lineModal, {}),
  init: function(){
      this.panel = document.body.appendChild(createDivClass("modal fade"))
      this.panel.setAttribute("tabindex", -1)
      let div = this.panel.appendChild(createDivClass("modal-dialog modal-fullscreen")).appendChild(createDivClass("modal-content"))
      let header = div.appendChild(createDivClass("modal-header"))
      header.appendChild(createElementClass("h1", "modal-title fs-5")).innerHTML = "Editor de linha"
      let btn = header.appendChild(createButton("btn-close"))
      btn.setAttribute("data-bs-dismiss", "modal")
      btn.setAttribute("aria-label", "Close")

      const dbody = div.appendChild(createDivClass("modal-body d-flex flex-column"))//.appendChild(createDivClass("container-fluid"))

      let footer = div.appendChild(createDivClass("modal-footer"))
      btn = footer.appendChild(createButton("btn btn-secondary"))
      btn.setAttribute("data-bs-dismiss", "modal")
      btn.innerHTML = "Cancelar"
      
      this.btn_save = footer.appendChild(createButton("btn btn-primary"))
      this.btn_save.innerHTML = "Salvar"

      //const dbody = edt_lineModal.querySelector(".container-fluid")
      //console.log(panel)
        // this.edtCtrlName = this.getCtrl("name")
        // this.edtCtrlTp = this.getCtrl("tp")
        // this.edtCtrlDec = this.getCtrl("dec")        
        // this.edtCtrlTp.onchange = ()=>{this.tpChanged()}

              
        //   const dbody = collapseCtrl.appendChild(createDivClass("accordion-body"))
        let dbodyA = dbody.appendChild(createDivClass("row mb-2"))
          let col
          // col = dbodyA.appendChild(createDivClass("col"))

          // this.line_header = createInput("b1" + this.id, "", false, "checkbox", "form-check-input")                    
          // col.appendChild(createDivCtrl("form-check", this.line_header, "Linha é cabeçalho"))
          
          // this.line_header.onclick = ()=>{
          //   if (this.line_header.checked){
          //     let a = accordionFile.querySelectorAll('.accordion-button.line-header');
          //     for (let i = 0; i < a.length; i++) {
          //         let b = a[i].obj
          //         if (b != this){
          //           b.setIsHeader(false)
          //         }
          //     }        
          //   }
          //   this.doSetIsHeader()
          // }
          // col = dbodyA.appendChild(createDivClass("col-auto"))
          // const btnAddCol = col.appendChild(document.createElement("button"))
          // btnAddCol.classList = "btn btn-outline-info me-1 btn-sm"
          // btnAddCol.innerHTML = "Add Coluna"
          // btnAddCol.type = "button"
          // btnAddCol.style.fontSize = "0.6rem"

          // let ctrl = col.appendChild(document.createElement("button"))
          // ctrl.classList = "btn btn-outline-danger btn-sm"
          // ctrl.innerHTML = "Excluir linha"
          // ctrl.type = "button"
          // ctrl.style.fontSize = btnAddCol.style.fontSize
          // ctrl.onclick = ()=>{
          //   if (confirm("Excluir linha: " + lineCode)){
          //     this.line.remove()
          //   }
          // }
          
          this.form = new bootstrap.Modal(this.panel, {})

          //dbodyA = dbody.appendChild(createDivClass("row"))
          //this.line_level = createInputNumber("b2" + this.id)
          //dbodyA.appendChild(createDivGroup("col-4 col-sm-3 col-md-3", this.line_level, "Nível"))
          this.line_code = createInputText("b2" + this.id)
          dbodyA.appendChild(createDivGroup("col-4 col-sm-3 col-md-3", this.line_code, "Código"))

          this.line_parente = createInputText("b3" + this.id)
          dbodyA.appendChild(createDivGroup("col-4 col-sm-3 col-md-3", this.line_parente, "Linha pai"))

          this.table_sulfix = createInputText("b4" + this.id)
          dbodyA.appendChild(createDivGroup("col-12 col-md-6", this.table_sulfix, "Nome no banco"))
          
          this.line_code.onchange = ()=>{
            this.table_sulfix.placeholder = this.line_code.value
          }

          this.line_descr = document.createElement("textarea")
          this.line_descr.classList = "form-control"
          this.line_descr.rows = 2
          this.line_descr.id = "line_descr" + this.id
          dbodyA.appendChild(createDivGroup("col-12", this.line_descr, "Descrição da Linha"))

          dbodyA = dbody.appendChild(createDivClass("overflow-auto"))          
          div = dbodyA//.appendChild(createDivClass("col"))
          let h5 = div.appendChild(document.createElement("h5"))
          h5.classList = "text-center"
          h5.innerHTML = "Colunas"
          div = div.appendChild(createDivClass("table-container"))
          //div.style.overflow = "scroll"
          this.tableCols = div.appendChild(document.createElement("table"))
          this.tableCols.classList = "table table-striped table-bordered text-center"
          let tr = this.tableCols.appendChild(document.createElement('thead'));
          colNames.titles.forEach(i => {tr.appendChild(document.createElement("th")).innerHTML = i});        
          //btnAddCol.onclick = ()=>{columnEditor.addRow(this.tableCols)}
          this.tableCols.appendChild(document.createElement('tbody'))

      },
      validateCtrls: function(lineObj){
                              let erros = 0;
                              const obj = this
                              function setError(edt, error){
                                  erros++;
                                  setCtrlInError(edt, error)
                              }
                              function check(edt){
                                            if (checkText(edt.value)) {
                                              return true
                                            }
                                            setError(edt, "Campo obrigatório")
                                            return false  
                                        }
                              
                              check(this.line_code)
                              const s = this.line_parente.value
                              if (isSetText(s)){
                                if (s == this.line_code.value) {
                                  setError(this.line_parente, "Linha pai não pode ser a própria linha")                                        
                                }else {
                                  let p = fileForm.linesGet(s)                                                                
                                  if (!p){
                                    setError(this.line_parente, "Linha pai não encontrada")                                        
                                  }else{
                                    let i = p.level
                                    while ((p = p.parentObj) != undefined){                                    
                                      if (p == lineObj || p.level >= i){
                                        setError(this.line_parente, "Erro nos níveis")
                                        break;
                                      }
                                      i = p.level
                                    }
                                  }
                                }
                              }
                              return erros
                        },
      formExecute: function(lineObj, then){
                              const obj = this
                              function saveClick(evt){
                                  if (obj.validateCtrls(lineObj) == 0){
                                        then()
                                        obj.form.hide()                              
                                  }
                              }
                              this.btn_save.onclick = saveClick
                              this.form.show()
                        },
    edit: function(lineObj){

        this.line_descr.style.height = this.line_descr.rows * 2 + "rem"
        
        for (let i = this.tableCols.rows.length - 1; i >= 0; i--) {
          this.tableCols.deleteRow(i);
        }    

        setCtrlValue(this.line_code, lineObj.code)
        this.table_sulfix.placeholder = this.line_code.value
        setCtrlValue(this.line_descr, lineObj.descr)
        setCtrlValue(this.line_parente, lineObj.parentCode)
        setCtrlValue(this.table_sulfix, lineObj.table_sulfix)
        lineObj.cols.forEach(col => {
          tableColsAddRow(this.tableCols, col.name, col.tp, col.pos, col.size, col.dec, col.lit, col.check, col.desc)
        });

        this.formExecute(lineObj, ()=>{                       
          lineObj.code = this.line_code.value
          lineObj.descr = this.line_descr.value
          lineObj.table_sulfix = this.table_sulfix.value

          lineObj.cols = []
          const rows = this.tableCols.rows
          for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].cells;            

            lineObj.cols.push({
              name: getCellA(cells[0]),
              tp: getCellA(cells[1]),
              pos: getCellA(cells[2]),
              size: getCellA(cells[3]),
              dec: getCellA(cells[4]),
              lit: getCellA(cells[5]),
              check: getCellB(cells[6]),
              desc: getCellB(cells[7])
            })
          }
          
          if (lineObj.parentCode != this.line_parente.value){            
            if (isSetText(lineObj.parentCode)){
              const p = fileForm.linesGet(lineObj.parentCode)   
              if (p){
                //console.log(p.childs)
                //p.childs.remove(lineObj) 
                const i = p.childs.indexOf(lineObj)
                //console.log(i)
                p.childs.splice(i, 1) 
                p.parentObj = undefined
                //const a = p.line.parentElement
                //console.log(a)
                //a.removeChild(lineObj.line)   
              }                                
            }               

            lineObj.parentCode = this.line_parente.value
            fileForm.addLine(lineObj)     
          }    
        })
    }
}
lineEditor.init()

let lineCount = 0

function createLine(lineCode){ 
    const obj = {
      id: ++lineCount,
      level: 0,
      code: lineCode,
        setIsHeader:  function(value){
        },
        init: function(){

          this.line = document.createElement("li")
          this.line.classList = "list-group-item node-treeview"
          this.line.style.color = undefined
          this.line.style.backgroundColor = undefined

          this.span = this.line.appendChild(createElementClass("span", "simple-item"))
          const item = this.line.appendChild(createElementClass("span", "lineText"))
          item.innerHTML = lineCode
          this.line.onclick = (evt)=>{
              lineEditor.edit(this)
              evt.stopPropagation()
          }
        },
        cols: [],
        childs: [],
        lineAdd: function (lineObj){
          if (this.UL == undefined){
            this.span.classList = "caret"
            this.span.onclick = (evt)=>{
              evt.stopPropagation()
              this.line.querySelector(".nested").classList.toggle("d-block");
              this.span.classList.toggle("caret-down");
            }
            this.UL = this.line.appendChild(createElementClass("ul", "nested list-group"))
          }
          this.UL.appendChild(lineObj.line)
          this.childs.push(lineObj)
          lineObj.parentObj = this
          lineObj.level = this.level + 1
          //console.log("lineObj.level: " + lineObj.level)
        },
        get: function(lineCode){
          if (this.code == lineCode){
            return this
          }
          for (let i = 0; i < this.childs.length; i++)  {
            const line = this.childs[i].get(lineCode);
            if (line){return line}      
          }
        } 
    }
    obj.init();   
    return obj;
}


function addLine(lineCode){
  const obj = createLine(lineCode)    
  document.getElementById("btnLoad").disabled = true
  return obj
}

function getLine(obj){
    let rows = obj.cols;
    const cols = []
  
    for (let i = 0; i < rows.length; i++) {
      const colValues = []
      
      const r = rows[i];
      colValues.push(r.name)
      colValues.push(r.tp)
      colValues.push(r.pos)
      colValues.push(r.size)
      colValues.push(r.dec)
      colValues.push(r.lit)
      colValues.push(r.check)
      
      for (let x = 7; x < 11; x++) {
        colValues.push("")
      }
      colValues.push(r.desc)

      cols.push(colValues)    
    }

    //console.log(obj)
    return {values: [obj.code, "", obj.level, "", "", obj.parentCode, 
                    "", "", "", "", obj.table_sulfix, obj.descr], cols: cols};  
}
function _getLines(list, out){
    //console.log(list)
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
        out.push(getLine(item))
        _getLines(item.childs, out)
    }   
}

function saveToFile(){    
    let erros = 0;
    function setError(edt){
        erros++;
        setCtrlInError(edt)
    }
    
    if (!isValidName(fileForm.edtMeta_name.value)){
          setError(fileForm.edtMeta_name)
    }
    if (!isValidName(fileForm.edtTable_name_prefix.value)){
          setError(fileForm.edtTable_name_prefix)
    }

    if (erros != 0){
        return
    }

  let lineHeaderCode = "0000"

  let lines = []    
 
  _getLines(fileForm.lines, lines)

  if (lines.length < 1){
    alert("Nenhuma linha informada")
    return
  }

  const fileName = fileForm.edtName.value
  const lfile = [
        fileForm.edtMeta_name.value, 
        fileForm.edtVersion.value, 
        fileForm.edtline_code_pos.value, 
        lineHeaderCode,
        fileForm.line_trailler_code,
        fileForm.edtcol_separator.value, 
        fileName, 
        fileForm.edtnatural_keys.value, 
        fileForm.edtdate_mask.value, 
        fileForm.edtversion_col_name.value, 
        fileForm.edtTable_name_prefix.value, 
        fileForm.edtdescr.value
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