require 'rubygems'
require 'hpricot'

class NodeChecker

  def isTextNode(node)
    return node.text?
  end
  
  def isVirtualTextNode(node)
	if !isInlineNode(node)
      return false
    end
    if node.respond_to? :each_child 
      node.each_child do |child|
        if !(isTextNode(child) || isVirtualTextNode(child))
          return false
        end
      end
    end       
    return true
  end
  
#a node that can be seen through the browser. The node’s width and height are
#not equal to zero -- DO THIS!
  def isValidNode(node)
    #TODO: need to calculate width & height
	
    return true  
  end
  
def getTagName(node)
    #retrieve the tag name
    str = node.to_s
    s = str.slice(/<\w+/)
    unless s.nil?
      tag = s[1,s.length]
    end
end

#VERIFY
  def isInlineNode(node)
    if node.comment?
      return true
    end
    tag = getTagName(node)
    if tag.nil?
      return true
    end
    ret = case tag   
    #From the tag list in http://www.w3schools.com/tags/default.asp
    when  "font", "em", "i", "b", "big", "small", "strike", "strong", "u", \
          "a", "pre", "img", "script", \
          "input", "select", "option", "optgroup", "button", \
          "span", "abbr", "acronym", "address", "blockquote", \
          "html", "head", "title", "style", \
          "area", "base", "bdo", "caption", "center", "cite", "code", \
          "col", "colgroup", "dd", "del", "dfn", "dl", "dt", \
          "fieldset", "ins", "kbd", "label", "legend", \
          "link", "map", "meta", "noframes", "noscript", "object", \
          "param", "q", "s", "samp", "sub", "sup", "textarea", \
          "table", "th", "tbody", "thead", "tfoot", "tt", "var", "xmp", \
          "menu", "isindex", "dir", "basefont", "applet", "!DOCTYPE",
          "embed"
      true
    when  "td", "tr", \
          "li", "ol", "ul", \
          "br", "p", "div", \
          "h1", "h2", "h3", "h4", "h5", "h6", "hr", \
          "form", "body", "frame", "frameset", "iframe"
      false
    else 
      puts "unknown tag: #{tag}"
    end
    return ret
  end
  
# the node with tag other than inline text tags.  
  def isLineBreakNode(node)
    return !isInlineNode(node)
  end
end
