/*
VERSION: 0.1.1
searchable-dropdown.js
author: Dan Koenig, dpkoenig27@gmail.com
license Copyright (c) 2017, Dan Koenig
Free to use under the WTFPL license
requires jquery
*/
(function(){
  $("select.searchable-select-element").each(function(){
    _dropdown = $(this);
    var arrowIndex = -1;
    var shouldHide = true;
    var headerIndicatorAttribute = "searchabledropdownindicator";
    _dropdown.css("display","none");
    var controlID = "searchableDropDown_"+Math.random().toString().split(".").join("")+Math.random().toString().split(".").join("")+Math.random().toString().split(".").join("");
    var ddHTML = "<div class='searchable-drop-down "+_dropdown.attr("class")+"' id='"+controlID+"'><input autocomplete='off' placeholder='"+$($(this).find(" option")[0]).text().replace("'", "&#39;")+"' type='text' class='select-search-box' /><ul>";
    var headereIndex = 0;
    _dropdown.find(" optgroup").each(function(){
      $(this).attr(headerIndicatorAttribute+"index", headereIndex);
      headereIndex++;
    });
    _dropdown.find(" optgroup > option").each(function(){
      $(this).attr(headerIndicatorAttribute+"ingroup", "true");
      $(this).attr(headerIndicatorAttribute+"groupindex", $($(this).parent()).attr(headerIndicatorAttribute+"index"));
    });
    _dropdown.find(" optgroup > option:first-child").each(function(){
      $(this).attr(headerIndicatorAttribute, $($(this).parent()).attr("label"));
      $(this).attr(headerIndicatorAttribute+"index", headereIndex);
      headereIndex++;
    });
    _dropdown.find(" option").each(function(){
      //console.log($($(this).parent()).find(" option:first-child"));
      var groupAttribute = "";
      var groupedItemClass = "";
      var groupClass = "";
      if($(this).attr(headerIndicatorAttribute+"ingroup") == "true"){
        groupAttribute = " groupindex='"+$(this).attr(headerIndicatorAttribute+"groupindex").toString()+"'";
        groupClass = " header-index-"+$(this).attr(headerIndicatorAttribute+"groupindex").toString();
        groupedItemClass = " searchable-dropdown-grouped-item";
      }
      if($(this).attr(headerIndicatorAttribute) != undefined){
        ddHTML+="<li class='searchable-header-item"+groupClass+"'>"+$(this).attr(headerIndicatorAttribute)+"</li>";
      }
      
      ddHTML+="<li class='searchable-select-item"+groupedItemClass+"' val='"+$(this).attr("value")+"'"+groupAttribute+">"+$(this).text()+"</li>";
    });
    ddHTML+="</ul></div>";
    _dropdown.after(ddHTML);
    $('div#'+controlID+" input.select-search-box").on("click",onInput);
    $('div#'+controlID+" input.select-search-box").on("keyup",onInput);
    $("div#"+controlID+" ul").on("mousedown",function(){
      shouldHide = false;
    });
    $('div#'+controlID+" input.select-search-box").on("mousedown",function(){
      shouldHide = false;
    });
    $("div#"+controlID+" li.searchable-select-item").click(function(){
      shouldHide = false;
      $("div#"+controlID+" li.searchable-select-item").removeClass("selected");
      _dropdown.val($(this).attr("val"));
      _dropdown.change();
      $('div#'+controlID+" input.select-search-box").val("");
      $("div#"+controlID+" li.searchable-select-item").removeClass("visible-item");
      $("div#"+controlID+" li.searchable-header-item").removeClass("visible-item");
      $('div#'+controlID+" input.select-search-box").attr("placeholder",$(this).text());
      $(this).addClass("selected");
      //console.log($(this).attr("val"));
    });
    $(function() {
      $("form").submit(function() { return false; });
    });
    $("body").on("mousedown",function(){
      setTimeout(function(){
        if(shouldHide){
          $("div#"+controlID+" li.searchable-select-item").removeClass("visible-item");
          $("div#"+controlID+" li.searchable-header-item").removeClass("visible-item");
          $('div#'+controlID+" input.select-search-box").val("");
        }
        else{
          shouldHide = true;
        }
      },100);
    });
    function onInput(e){
      //shouldHide = false;
      //console.log($(this).val());
      //console.log(e.keyCode);
      var shouldRunSearch = true;
      if(e != undefined && e.keyCode != undefined){
        if(e.keyCode == 38){
          // up
          arrowIndex-=1;
          if(arrowIndex < 0){
            arrowIndex = $("div#"+controlID+" li.searchable-select-item.visible-item").length-1;
          }
          shouldRunSearch = false;
        }
        else if(e.keyCode == 40){
          // down
          arrowIndex+=1;
          if(arrowIndex >= $("div#"+controlID+" li.searchable-select-item.visible-item").length){
            arrowIndex = 0;
          }
          shouldRunSearch = false;
          
        }
        else if(e.keyCode == 13){
          e.preventDefault();
          if(arrowIndex >= 0){
            $($("div#"+controlID+" li.searchable-select-item.visible-item")[arrowIndex]).click();
            $("div#"+controlID+" li.searchable-select-item").removeClass("visible-item");
            $("div#"+controlID+" li.searchable-header-item").removeClass("visible-item");
            setTimeout(function(){$('div#'+controlID+" input.select-search-box").blur()},100);
            
          }
          else{
            $("div#"+controlID+" li.searchable-select-item").removeClass("visible-item");
            $("div#"+controlID+" li.searchable-header-item").removeClass("visible-item");
            $('div#'+controlID+" input.select-search-box").val("");
          }
          shouldRunSearch = false;
        }
        
      }
      
      if(shouldRunSearch){
        arrowIndex = -1;
        
        var inputText = $(this).val().toLowerCase();
        $("div#"+controlID+" li.searchable-select-item").removeClass("visible-item");
        $("div#"+controlID+" li.searchable-header-item").removeClass("visible-item");
        //if(inputText != "" && inputText != undefined){
          $("div#"+controlID+" li.searchable-select-item").each(function(){
            //console.log($(this).text());
            if($(this).text().toLowerCase().split(inputText).length>1){
              $(this).addClass("visible-item");
              $("li.header-index-"+$(this).attr("groupindex")).addClass("visible-item");
            }
          });
        }
        $("div#"+controlID+" li.searchable-select-item.visible-item").removeClass("arrow-over");
        if(arrowIndex>=0){
          $($("div#"+controlID+" li.searchable-select-item.visible-item")[arrowIndex]).addClass("arrow-over");
          $("div#"+controlID+" ul").scrollTop($($("div#"+controlID+" li")[arrowIndex]).offset().top-50-$("div#"+controlID+" ul").offset().top+$("div#"+controlID+" ul").scrollTop());
        }
        //console.log(arrowIndex);
      //}
      

    }
  });
  
})();