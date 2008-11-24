require 'rubygems'
require 'hpricot'

class NodeChecker
  def initialize
    
  end
  def to_s
    
  end
#the DOM node corresponding to free text, which does not have an html tag.
  def isTextNode(node)
    return node.text?
  end
  
#Inline node with only text node children is a virtual text node.
#Inline node with only text node and virtual text node children is a virtual text node.  
  def isVirtualTextNode(node)
    if isInlineNode(node)
      return false
    end
    if node.respond_to? :each_child 
      node.each_child do |child|
        unless isTextNode(child)
          return false
        end
        unless isVirtualTextNode(child)
          return false
        end
      end
    end       
    return true
  end
  
#a node that can be seen through the browser. The node’s width and height are
#not equal to zero.  
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
    #return tag
    #regex = "/<\/?\w+((\s+(\w|\w[\w-]*\w)(\s*=\s*(?:\".*?\"|'.*?'|[^'\">\s]+))?)+\s*|\s*)\/?>/i"
  end

#the DOM node with inline text HTML tags, which affect the appearance of
#text and can be applied to a string of characters without introducing line break. Such tags
#include <B>, <BIG>, <EM>, <FONT>, <I>, <STRONG>, <U>, etc.
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
