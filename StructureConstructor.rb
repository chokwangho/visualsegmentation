require 'BlockPool'
require 'SeparatorDetector'
require 'BlockTree'

class StructureConstructor

  attr_accessor :blockPool, :separatorList

  def initialize(blockPool, separatorList)
    @blockPool = blockPool
	@separatorList = separatorList
  end
  
  def to_s
    
  end  
  
  def buildTree
	root = nil
	
	while (@separatorList.size > 0)
	min_weight = @separatorList[0].weight
	min_index = 0
	@separatorList.each_with_index { |separator, index|
		if (separator.weight < min_weight) 
			min_weight = separator.weight
			min_index = index
		end
	}
  
	puts "MIN_WEIGHT: #{min_weight} MIN_INDEX: #{min_index}"
	
	combine = Array.new
	index = min_index
	while ((@separatorList.size > 0) && (@separatorList[index].weight == min_weight) && (@separatorList[index].orientation==@separatorList[min_index].orientation))
		combine.push(@separatorList[index])
		@separatorList.delete_at(index)
	end
	
	puts "Array size: #{combine.size}"
	puts "Array size of separator list: #{@separatorList.size}"

	combine.sort! {|x, y| y <=> x}
	
	#sort separators
	blockArray = Array.new
	blockArray.concat(combine[0].tl_side)
	combine.each { |c|
		blockArray.concat(c.br_side)
	}
	
	blockArray.each { |b|
		puts "#{b.offsetTop} : #{b.tag} + #{b.children}"
	}
	
	root = create_block(blockArray)
	end
	
	return root
  end

  def create_block(children)
		
	block = Block.new(nil, "CREATED")
    
	min_x, max_x = children[0].offsetLeft, children[0].offsetLeft + children[0].width
	min_y, max_y = children[0].offsetTop, children[0].offsetTop + children[0].height
	minx_i, maxx_i = 0, 0
	miny_i, maxy_i = 0, 0

	children.each_with_index{ |child, index|
		child.parent = block
		if (child.offsetLeft < min_x) 
			min_x=child.offsetLeft
			minx_i=index 
		end
		if ((child.offsetLeft + child.width) > max_x) 
			max_x=(child.offsetLeft + child.width)
			maxx_i=index 
		end
		if (child.offsetTop < min_y) 
			min_y=child.offsetTop 
			miny_i=index
		end
		if ((child.offsetTop + child.height) > max_y) 
			max_y=(child.offsetTop + child.height) 
			maxy_i=index
		end
	}
	block.children = children

	block.offsetLeft = min_x
    block.offsetTop = min_y
    block.width = max_x - min_x
    block.height = max_y - min_y
#	block.bg_color = getPropertyValue(node, "mybackgroundcolor")
#	block.fontsize = getPropertyValue(node, "myfontsize")
#	block.fontweight = getPropertyValue(node, "myfontweight")

	# fix the separator configurations 
	sep = nil
	if !((sep=children[minx_i].separators[1]).nil?)
		sep.br_side.each{|br|
			br.separators[1]=nil}
		sep.br_side.clear
		sep.add_2_br_side(block)
		block.separators[1]=sep
	end
	if !((sep=children[maxx_i].separators[3]).nil?)
		sep.tl_side.each{|tl|
		tl.separators[3]=nil}
		sep.tl_side.clear
		sep.add_2_tl_side(block)
		block.separators[3]=sep
	end
	if !((sep=children[miny_i].separators[0]).nil?)
		sep.br_side.each{|br|
		br.separators[0]=nil}
		sep.br_side.clear
		sep.add_2_br_side(block)
		block.separators[0]=sep
	end
	if !((sep=children[maxy_i].separators[2]).nil?)
		sep.tl_side.each{|tl|
		tl.separators[2]=nil}
		sep.tl_side.clear
		sep.add_2_tl_side(block)
		block.separators[2]=sep
	end
	
	return block
 
   end

  
end