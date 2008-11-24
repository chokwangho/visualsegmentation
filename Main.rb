require 'rubygems'
#require 'mechanize'
require 'hpricot'
require 'open-uri'
require 'tamtam'
#require 'csspool'
require 'BlockExtractor'
require 'SeparatorDetector'
require 'StructureConstructor'

def visualizeSections(html_doc, location)
#  html_doc.search('link').each do |e|
#    link_loc = e["href"]
#    new_loc = location+link_loc
#    e.set_attribute(:href,new_loc)
#    puts e["href"]
#  end
#  
#  html_doc.search('img').each do |e|
#    img_loc = e["src"]
#    new_loc = location+img_loc
#    e.set_attribute(:src,new_loc)
#    puts e["src"]
#  end  

  html_file = File.new("new.html", "w")
  html_file.puts html_doc.to_html
  
#  i=0  
#  html_doc.traverse_element("div"){ |e| 
#    if (e.to_html.strip != "")
#      puts e.get_attribute("style")
#      e.set_attribute(:style, "border-width: thick; border-style: dashed; border-color: red;")
#      html_file = File.new("html/snippet_"+i.to_s+".html", "w")
#      #html_file.puts e.to_html
#      html_file.puts html_doc.to_html
#      e.set_attribute(:style, "")
#      i+=1
#    end  
#  }
end

  
if __FILE__ == $0
  
# step 0
#  cssParser = CSS::SAC::Parser.new
#  cssDoc = cssParser.parse("example.css") 
#  cssDoc.find_all_rules_matching("example.html").each do |rule| 
#    p rule 
#  end 
#
#inlined = TamTam.inline(
#  :css => File.read('cs147-general.css'),
#  :body => File.read('cs147.html')
#)
#    html_file = File.new("result.html", "w")
#    html_file.puts inlined
#puts inlined
   
# step 1
  extractor = BlockExtractor.new                 
  location = "retrieved-13.html"
  #location = "http://cs.stanford.edu"
  doc = Hpricot(open(location))
  #body = doc.search("/html/body")
  body = doc.search("/body")
  bodyWidth, bodyHeight = 0, 0
  
  body.each do |node|
    bodyWidth = extractor.getPropertyValue(node, "mywidth")
    bodyHeight = extractor.getPropertyValue(node, "myheight")
    extractor.divideDOMTree(node, 10)
  end  
  
# step 2
  #puts extractor.blockPool
  detector = SeparatorDetector.new(extractor.blockPool, bodyWidth, bodyHeight)    
  detector.evaluateRelation
  detector.assignWeights
  #detector.test

  detector.drawSeparators(doc, body)


# step 3  
  constructor = StructureConstructor.new    

  #Permitted Degree of Coherence
  # to achieve different granularities of content structure for different applications. 
  # The smaller the PDoC is, the coarser the content structure would be.
  pDoC = 5

  visualizeSections(doc, location)

end

