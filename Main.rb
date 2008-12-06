require 'rubygems'
require 'hpricot'
require 'open-uri'
require 'BlockExtractor'
require 'SeparatorDetector'
require 'StructureConstructor'

def visualizeSections(html_doc, location)
  html_file = File.new("new.html", "w")
  html_file.puts html_doc.to_html
end

if __FILE__ == $0

# step 1
  extractor = BlockExtractor.new
  location = "mint.html"
  doc = Hpricot(open(location))
  body = doc.search("/body")
  bodyWidth, bodyHeight = 0, 0

  body.each do |node|
    bodyWidth = extractor.getPropertyValue(node, "mywidth").to_i
    bodyHeight = extractor.getPropertyValue(node, "myheight").to_i
    extractor.divideDOMTree(node, nil, 10)
	#puts"COUNT: #{extractor.count}"
  end

# step 2
  detector = SeparatorDetector.new(extractor.blockPool, bodyWidth, bodyHeight)
  detector.evaluateRelation
  detector.assignWeights
  detector.drawSeparators(doc, body)


# step 3
  constructor = StructureConstructor.new
  #Permitted Degree of Coherence
  # to achieve different granularities of content structure for different applications.
  # The smaller the PDoC is, the coarser the content structure would be.
  pDoC = 5

  visualizeSections(doc, location)
end
