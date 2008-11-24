var StyleRetriever = {
  onLoad: function() {
    //You can place set-up code for the extension here
  },

  onMenuItemCommand: function() {
    window.open("chrome://StyleRetriever/content/StyleRetriever.xul", "", "chrome, resizable=yes");
  }
};

window.addEventListener("load", function(e) { Stats.onLoad(e); }, false);

