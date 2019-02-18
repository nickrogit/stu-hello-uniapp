
      !(function(){
        var uniAppViewReadyCallback = function(){
          document.dispatchEvent(new CustomEvent("generateFuncReady", { detail: { generateFunc: $gwx('./platforms/app-plus/blueya/blueya.wxml') } }));
        }
        if(window.__uniAppViewReady__){
          uniAppViewReadyCallback()
        }else{
          document.addEventListener('uniAppViewReady',uniAppViewReadyCallback)
        }
      })();
      