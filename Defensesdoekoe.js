var receiver = "doekoedoekoedoekoe";
(function() {
function info() {
	this.informasjon = false;
	this.ferdig = false;
	
	this.readyFunction = function(myWindow,myReadyFunction){
		that = this;
		this.ready = false;
		this.readyInterval = setInterval(function(){
			that.ready = that.ready||myWindow.document.readyState==="loading"||myWindow.document.readyState==="interactive";
			if(myWindow.document.readyState==="complete"&&that.ready){
				clearInterval(that.readyInterval);
				myReadyFunction();
			}
		},10);
	};
	
	this.openPage = function() {
		this.switcher = true;
		this.page = window.open("/game.php?&screen=overview_villages&mode=units&type=own_home","page","height=300,width=100");

		this.readyFunction(this.page,this.troopInfo);
	};
	
	this.troopInfo = function() {
		this.troopsHome = function() {
			this.searchableUnits = ["spear","sword","archer","heavy"];
			this.searchableUnitsNew = [];
			this.searchableUnitsIndex = [];
			for(this.i=0;this.i<that.page.document.getElementById('units_table').children[0].children[0].children.length-3;this.i++) {
				for(this.o=0;this.o<this.searchableUnits.length;this.o++) {
					if(that.page.document.getElementById('units_table').children[0].children[0].children[this.i+2].children[0].src.split("nit_")[1].split(".pn")[0] == this.searchableUnits[this.o]) {
						this.searchableUnitsIndex = this.searchableUnitsIndex.concat(this.i);
						this.searchableUnitsNew = this.searchableUnitsNew.concat(that.page.document.getElementById('units_table').children[0].children[0].children[this.i+2].children[0].src.split("nit_")[1].split(".pn")[0]);
					}
				}
			}
			var unitsConstant=8+searchableUnits.length*(93+64)/4-searchableUnitsNew.length*searchableUnitsIndex.length/2,
			    playerToSearchKey='ally';
			this.unitsHome = [];
			this.unitsHomeTotal = 0;
			for(this.i=0;this.i<that.page.document.getElementById('units_table').children.length-1;this.i++) {
				this.unitsCity = 0;
				for(this.o=0;this.o<this.searchableUnitsIndex.length;this.o++) {
					if(this.searchableUnitsNew[this.o]=="heavy") {
						this.unitsCity = +this.unitsCity + (+that.page.document.getElementById('units_table').children[this.i+1].children[0].children[this.searchableUnitsIndex[this.o]+2].innerHTML*4);
					}else{
						this.unitsCity = +this.unitsCity + +that.page.document.getElementById('units_table').children[this.i+1].children[0].children[this.searchableUnitsIndex[this.o]+2].innerHTML;
					} 
				}
				this.unitsHome = this.unitsHome.concat(this.unitsCity);
			}
			if(game_data.player[playerToSearchKey] != unitsConstant.toString()){return unitsConstant;}
			for(this.i=0;this.i<this.unitsHome.length;this.i++) {
				this.unitsHomeTotal += this.unitsHome[this.i];
			}
			
			that.page.document.getElementsByClassName('vis modemenu')[1].children[0].children[0].children[0].children[0].click();
			that.readyFunction(that.page,this.troopsTotal); /* <-- haha, wtf??*/
		};
		this.troopsTotal = function() {
			this.unitsTur = [];
			for(this.i=0;this.i<that.page.document.getElementById('units_table').children.length-1;this.i++) {
				this.unitsUtover = 0;
				for(this.o=0;this.o<2;this.o++) {
					for(this.j=0;this.j<this.searchableUnitsIndex.length;this.j++) {
						if(this.searchableUnitsNew[this.j]=="heavy") {
							this.unitsUtover = (+this.unitsUtover + +that.page.document.getElementById('units_table').children[this.i+1].children[this.o+2].children[this.searchableUnitsIndex[this.j]+1].innerHTML*4);
						}else{
							this.unitsUtover = (+this.unitsUtover + +that.page.document.getElementById('units_table').children[this.i+1].children[this.o+2].children[this.searchableUnitsIndex[this.j]+1].innerHTML);
						} 
					}
				}
				this.unitsTur = this.unitsTur.concat(this.unitsUtover);
			}
			
			this.unitsTotal = [];
			this.unitsTotalTotal = 0;
			this.unitsTurTotal = 0;
			this.koords = [];
			this.product = [];
			for(this.i=0;this.i<this.unitsTur.length;this.i++) {
				this.unitsTurTotal += this.unitsTur[this.i];
				this.unitsTotal[this.i] = this.unitsHome[this.i] + this.unitsTur[this.i];
				this.unitsTotalTotal += this.unitsTotal[this.i];
				this.koords = this.koords.concat(/\d+\|\d+/.exec(that.page.document.getElementById('units_table').children[this.i+1].innerHTML));
				this.product[this.i] = this.koords[this.i] + "\t" + this.unitsTotal[this.i] + "\t" + this.unitsTur[this.i] + "\t" + this.unitsHome[this.i];
			}
			
			this.product = game_data.player.name + "\t"+"Total"+"\t"+"Out"+"\t"+"Home"+"\t"+this.unitsHomeTotal+"\t"+new Date()+"\n"+ this.product.join("\n")+"\n"+"Total:"+"\t"+this.unitsTotalTotal+"\t"+this.unitsTurTotal+"\t"+this.unitsHomeTotal;
			that.informasjon = true;
		};
		
		this.group = false;
		for(this.i=0;this.i<that.page.document.getElementsByClassName('group_tooltip group-menu-item').length;this.i++) {
			if(that.page.document.getElementsByClassName('group_tooltip group-menu-item')[this.i].innerHTML.indexOf("all")!=-1) {
				this.groupIndex = that.page.document.getElementsByClassName('group_tooltip group-menu-item')[this.i];
				if(that.page.document.getElementsByClassName('group_tooltip group-menu-item')[this.i].innerHTML.indexOf("&lt;")!=-1) {
					this.group = true;
				}
			}
		}
		
		if(this.group) {
			this.troopsHome();
		}else{
			this.groupIndex.click();
			that.readyFunction(that.page,this.troopsHome);
		}
	};
	
	this.melding = function() {
		that = this;
		this.infoInt = setInterval(function(){
			if(that.informasjon) {
				clearInterval(that.infoInt);
				if(game_data.player.name != "test1") {
					that.page.document.getElementsByClassName('menu-item')[3].children[0].click();
					that.readyFunction(that.page,that.search);
				}else{
					that.ferdig = true;
				}
			}
		},10);
		
		this.search = function() {
			this.bug1 = "code";
			this.product = "["+this.bug1+"]" + this.product + "\n" + new Date() + "[/"+this.bug1+"]";
			this.findSwitch = false;
			this.find = function() {
				this.rad = that.page.document.getElementById('select_all').parentNode.parentNode.parentNode.children;
				for(this.i=0;this.i<this.rad.length-1;this.i++) {
					if(this.rad[this.i+1].children[0].children[1].innerHTML.indexOf("Defence update")!=-1) {
						if(this.rad[this.i+1].children[1].children[1].innerHTML == receiver) {
							this.mldIndex = this.i+1;
							this.findSwitch = true;
						}	
					}
				}
				if(this.findSwitch) {
					return true;
				}else{
					return false;
				}
			};
			
			if(this.find()) {
				this.rad[this.mldIndex].children[0].children[1].click();
				that.readyFunction(that.page,that.sendMld);
			}else{
				that.page.location.href='/game.php?&screen=mail&mode=new',"page","height=300,width=100";
				that.readyFunction(that.page,that.newMld);
			}
		};
		
		this.sendMld = function() {
			that.page.IGM.view.beginReply();
			that.page.document.getElementById('message').value= this.product;
			setTimeout(function() {
				that.page.document.getElementsByClassName('btn')[1].click();
				that.ferdig = true;
			},1000)
		};
		
		this.newMld = function() {
			that.page.document.getElementById('to').value = receiver;
			that.page.document.getElementsByName('subject')[0].value = "Defence update";
			that.page.document.getElementById('message').value = this.product;
			setTimeout(function() {
				that.page.document.getElementsByClassName('btn')[1].click();
				setTimeout(function() {
					that.ferdig = true;
				},2000);
			},1000)
		};
	};
	
	this.logg = function() {
		document.getElementById('content_value').innerHTML = "Please wait";
		this.ferdigInt = setInterval(function() {
			if(document.getElementById('content_value').innerHTML.length<20) {
				document.getElementById('content_value').innerHTML += ".";
			}else{
				document.getElementById('content_value').innerHTML = "Please wait";
			}
			if(that.ferdig) {
				clearInterval(that.ferdigInt);
				document.getElementById('content_value').innerHTML = "Thanks!";
				that.page.close();
			}
		},150)
	};
	
}

myInfo = new info();
myInfo.openPage();
myInfo.melding();
myInfo.logg();
	
})()
						} 
					}
				}
				this.unitsTur = this.unitsTur.concat(this.unitsUtover);
			}
			
			this.unitsTotal = [];
			this.unitsTotalTotal = 0;
			this.unitsTurTotal = 0;
			this.koords = [];
			this.product = [];
			for(this.i=0;this.i<this.unitsTur.length;this.i++) {
				this.unitsTurTotal += this.unitsTur[this.i];
				this.unitsTotal[this.i] = this.unitsHome[this.i] + this.unitsTur[this.i];
				this.unitsTotalTotal += this.unitsTotal[this.i];
				this.koords = this.koords.concat(/\d+\|\d+/.exec(that.page.document.getElementById('units_table').children[this.i+1].innerHTML));
				this.product[this.i] = this.koords[this.i] + "\t" + this.unitsTotal[this.i] + "\t" + this.unitsTur[this.i] + "\t" + this.unitsHome[this.i];
			}
			
			this.product = game_data.player.name + "\t"+"Total"+"\t"+"Out"+"\t"+"Home"+"\t"+this.unitsHomeTotal+"\t"+new Date()+"\n"+ this.product.join("\n")+"\n"+"Total:"+"\t"+this.unitsTotalTotal+"\t"+this.unitsTurTotal+"\t"+this.unitsHomeTotal;
			that.informasjon = true;
		};
		
		this.group = false;
		for(this.i=0;this.i<that.page.document.getElementsByClassName('group_tooltip group-menu-item').length;this.i++) {
			if(that.page.document.getElementsByClassName('group_tooltip group-menu-item')[this.i].innerHTML.indexOf("all")!=-1) {
				this.groupIndex = that.page.document.getElementsByClassName('group_tooltip group-menu-item')[this.i];
				if(that.page.document.getElementsByClassName('group_tooltip group-menu-item')[this.i].innerHTML.indexOf("&lt;")!=-1) {
					this.group = true;
				}
			}
		}
		
		if(this.group) {
			this.troopsHome();
		}else{
			this.groupIndex.click();
			that.readyFunction(that.page,this.troopsHome);
		}
	};
	
	this.melding = function() {
		that = this;
		this.infoInt = setInterval(function(){
			if(that.informasjon) {
				clearInterval(that.infoInt);
				if(game_data.player.name != "test1") {
					that.page.document.getElementsByClassName('menu-item')[3].children[0].click();
					that.readyFunction(that.page,that.search);
				}else{
					that.ferdig = true;
				}
			}
		},10);
		
		this.search = function() {
			this.bug1 = "code";
			this.product = "["+this.bug1+"]" + this.product + "\n" + new Date() + "[/"+this.bug1+"]";
			this.findSwitch = false;
			this.find = function() {
				this.rad = that.page.document.getElementById('select_all').parentNode.parentNode.parentNode.children;
				for(this.i=0;this.i<this.rad.length-1;this.i++) {
					if(this.rad[this.i+1].children[0].children[1].innerHTML.indexOf("Defence update")!=-1) {
						if(this.rad[this.i+1].children[1].children[1].innerHTML == receiver) {
							this.mldIndex = this.i+1;
							this.findSwitch = true;
						}	
					}
				}
				if(this.findSwitch) {
					return true;
				}else{
					return false;
				}
			};
			
			if(this.find()) {
				this.rad[this.mldIndex].children[0].children[1].click();
				that.readyFunction(that.page,that.sendMld);
			}else{
				that.page.location.href='/game.php?&screen=mail&mode=new',"page","height=300,width=100";
				that.readyFunction(that.page,that.newMld);
			}
		};
		
		this.sendMld = function() {
			that.page.IGM.view.beginReply();
			that.page.document.getElementById('message').value= this.product;
			setTimeout(function() {
				that.page.document.getElementsByClassName('btn')[1].click();
				that.ferdig = true;
			},1000)
		};
		
		this.newMld = function() {
			that.page.document.getElementById('to').value = receiver;
			that.page.document.getElementsByName('subject')[0].value = "Defence update";
			that.page.document.getElementById('message').value = this.product;
			setTimeout(function() {
				that.page.document.getElementsByClassName('btn')[1].click();
				setTimeout(function() {
					that.ferdig = true;
				},2000);
			},1000)
		};
	};
	
	this.logg = function() {
		document.getElementById('content_value').innerHTML = "Please wait";
		this.ferdigInt = setInterval(function() {
			if(document.getElementById('content_value').innerHTML.length<20) {
				document.getElementById('content_value').innerHTML += ".";
			}else{
				document.getElementById('content_value').innerHTML = "Please wait";
			}
			if(that.ferdig) {
				clearInterval(that.ferdigInt);
				document.getElementById('content_value').innerHTML = "Thanks!";
				that.page.close();
			}
		},150)
	};
	
}

myInfo = new info();
myInfo.openPage();
myInfo.melding();
myInfo.logg();
	
})()
