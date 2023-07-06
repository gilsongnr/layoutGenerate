const lineSpliter = {
    idx: 0, 
    lines: undefined,
    inData: 0,
    colsSeparator: ";",
    tmp: "",
    reset: function(lines){
        this.lines = lines
        this.idx = 0;
        this.inData = 0;
        this.tmp = ""
    },
    addCol: function(cols) {
		if (this.tmp.length > 0) {
			cols.push(this.tmp);
			this.tmp = "";
		} else {
			cols.push("");
		}
	},
    split: function(line, cols){        
        if (this.inData != 1) {
            this.inData = 0;
            line = line.trim();
        }

        if (line == "") { return false; }
        for (let i = 0; i < line.length; i++) {
            let c = line.charAt(i)
            switch (this.inData) {
            case 0:
                if (c == '"') {
                    this.inData = 1;
                } else if (c == this.colsSeparator) {
                    this.addCol(cols);
                } else {
                    this.tmp += c;
                }
                break;
            
            case 1:
                if (c == '"') {
                    this.inData = 2;
                } else {
                    this.tmp += c;
                }
                break;
            
            default:
                if (c == this.colsSeparator) {
                    this.addCol(cols);
                    this.inData = 0;
                } else {
                    this.tmp += c;
                    if (c == '"') {
                        this.inData = 1;
                    } else {
                        this.inData = 0;
                    }
                }
                break;
            }
        }
        if (this.inData == 1) {
            this.tmp += "\n";
            return false;
        }
        this.addCol(cols);
        return true;
    },
    next: function(){
        const cols = []
        while (this.idx < this.lines.length){
            if (this.split(this.lines[this.idx++], cols)) {
                break
            }
        } 
        return cols
    }
}
