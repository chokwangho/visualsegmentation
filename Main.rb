require 'rubygems'
require 'hpricot'
require 'open-uri'
require 'BlockExtractor'
require 'SeparatorDetector'
require 'StructureConstructor'
require 'BlockTree'

PDOC = 7

def visualizeSections(html_doc, location)
  html_file = File.new("new.html", "w")
  html_file.puts html_doc.to_html
end

def vips_algorithm (block, body, doc)
	extractor = BlockExtractor.new
	if block.node.respond_to? :each_child 
        block.node.each_child do |child|
          extractor.divideDOMTree(child, block, 10, doc)
        end
	
		detector = SeparatorDetector.new(extractor.blockPool, block.width, block.height)
		detector.evaluateRelation
		detector.assignWeights
		detector.drawSeparators(body)
	
		constructor = StructureConstructor.new(detector.blockPool, detector.separatorList, block)
		constructor.buildTree
		puts "NUM CHILDREN: #{block.children.size}"
		detector.blockPool.each { |leaf_block|
			if (leaf_block.doc <= PDOC)
				vips_algorithm(leaf_block, body, doc)
			end
		}
	end
end

if __FILE__ == $0
  location = "mint.html"
  doc = Hpricot(open(location))
  body = doc.search("/body")

  root_node = nil  
  body.each do |node|
	root_node = node
  end
	
  extractor = BlockExtractor.new
  root_block = extractor.create_block(root_node, nil, 10)	#TODO: make this a static function of the class
  vips_algorithm(root_block, body, doc)

  html=""
  html = html + "<div style='left:" + root_block.children[2].offsetLeft.to_s + "px; top:" + root_block.children[2].offsetTop.to_s + "px;width:" + root_block.children[2].width.to_s
    html = html + "px;height:" + root_block.children[2].height.to_s
    html = html + "px;background-color:transparent;border-width:thick;border-style:dashed;z-index:400000;position:absolute;float:center;'></div>"
  body.append(html)

  visualizeSections(doc, location)
end
