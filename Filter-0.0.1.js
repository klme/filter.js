//////////////////////
/////filter-0.0.1/////
//////////////////////
var Filter = function(imgSrc,parentElementId){
  this.img = new Image();
  this.img.src = imgSrc || "sample.png";
  this.img.width = 0;
  this.img.height = 0;
  this.parentElement = document.querySelector("#"+parentElementId) || "div";
  this.canvasElement = null;
  this.context = null;
  this.gray=0;
  this.imageData=null;
  this.bitmapData=null;
  this.originalData=null;
  this.R=[];
  this.G=[];
  this.B=[];
  this.A=[];
  this.index=0;
  this.initFinishedFlag = false;
  this.NTSCCOEFFICIENTS_RED = 0.298912;
  this.NTSCCOEFFICIENTS_GREEN = 0.586611;
  this.NTSCCOEFFICIENTS_BLUE = 0.114478;
  this.negaNumber=0;

  //初期化処理
  this.init();
}


Filter.prototype.init = function(){
  this.canvasElement = document.createElement("canvas");
	this.context = this.canvasElement.getContext("2d");
  this.parentElement.appendChild(this.canvasElement);

  var _this = this;
  this.img.onload = function(){
    _this.hello="hello";
    _this.canvasElement.width = this.naturalWidth;
    _this.canvasElement.height = this.naturalHeight;

    _this.context.drawImage(this,0,0);
    this.width = this.naturalWidth;
    this.height = this.naturalHeight;
    _this.imageData = _this.context.getImageData(0,0,this.width,this.height);
		//参照渡しだから，ドット演算子で時間を食ってしまうからポインタを渡している．
		_this.bitmapData = _this.imageData.data;
		_this.originalData = _this.arrayCopy(_this.imageData.data);

    for(var j=0;j<this.height;j++){
			for(var i=0;i<this.width;i++){
				_this.index = (j*this.width+i)*4;
				//配列の初期化
        _this.R.push(_this.bitmapData[_this.index+0]);
        _this.G.push(_this.bitmapData[_this.index+1]);
        _this.B.push(_this.bitmapData[_this.index+2]);
        _this.A.push(_this.bitmapData[_this.index+3]);
        }
			}
		_this.context.putImageData(_this.imageData,0,0);
    _this.initFinishedFlag = true;
  }
}

Filter.prototype.arrayCopy = function(a){
 var b=[];
 	for(var array_i=0;array_i<a.length;array_i++){
 		b[array_i] = a[array_i];
 	}
 return b;
}

 Filter.prototype.grayScale = function(){
      if(!this.initFinishedFlag){
        setTimeout(this.grayScale.bind(this),1);
        return;
      }
       for(var j=0;j<this.img.height;j++){
         for(var i=0;i<this.img.width;i++){
         this.index = (j*this.img.width+i);
         this.gray= this.NTSCCOEFFICIENTS_RED*this.R[this.index]+this.NTSCCOEFFICIENTS_GREEN*this.G[this.index]+this.NTSCCOEFFICIENTS_BLUE*this.B[this.index];
         this.gray = Math.floor(this.gray);
         //小数点が代入されると四捨五入される．
         this.bitmapData[this.index*4+0] = this.gray;
         this.bitmapData[this.index*4+1] = this.gray;
         this.bitmapData[this.index*4+2] = this.gray;
         this.bitmapData[this.index*4+3] = this.A[this.index];
           }
         }
       this.context.putImageData(this.imageData,0,0);
 }




Filter.prototype.nega = function(){
  if(!this.initFinishedFlag){
        setTimeout(this.nega.bind(this),1);
        return;
      }
  for(var j=0;j<this.img.height;j++){
    for(var i=0;i<this.img.width;i++){
      this.index = (j*this.img.width+i);
      this.negaNumber = this.maxPlusMin(this.R[this.index],this.G[this.index],this.B[this.index])
      this.bitmapData[this.index*4+0] = this.negaNumber-this.R[this.index];
      this.bitmapData[this.index*4+1] = this.negaNumber-this.G[this.index];
      this.bitmapData[this.index*4+2] = this.negaNumber-this.B[this.index];
      this.bitmapData[this.index*4+3] = this.A[this.index];
    }
  }
  this.context.putImageData(this.imageData,0,0);
}


Filter.prototype.maxPlusMin = function(r,g,b){
  if(r>=g&&b>=r||g>=r&&r>=b){
    return g+b;
  }else if(r>=g&&b>=g||r>=g&&g>=b){
    return r+b;
  }else if(r>=b&&g>=b||r>=b&&b>=g){
    return g+r;
  }
}