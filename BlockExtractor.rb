require 'rubygems'
require 'hpricot'
require 'NodeChecker'
require 'Block'
require 'BlockPool'

# should have one for width and one for height
SIZE_THRESHOLD = 0.45
    
class BlockExtractor
	DIVIDE = 0
	NOT_DIVIDE = 1
	FINISHED = 2

  attr_accessor :blockPool, :count, :p_block
  
  def initialize(p_block)
    @nodeChecker = NodeChecker.new
    @blockPool = BlockPool.new
	@count=0
	@p_block=p_block
  end
  
  def getPropertyValue(node, property)
    unless node.respond_to? :get_attribute
      return
    end
    styleText = node.get_attribute(property)   
    unless styleText.to_s.nil?    
      return styleText.to_s
    end
  end  

  def applyHeuristics(block, heuristicArray)
    heuristicArray.each_with_index {|flag, index|
      if flag == 1  
        func = "rule#{index}".to_sym
        if self.respond_to? func		
          ret = self.send(func, block)
		  if !(ret.nil?)
            return ret
          end
        end
      end
    }
  end

  def create_block(node, parent, level)
	block = Block.new(node, @nodeChecker.getTagName(node))
    block.offsetLeft = getPropertyValue(node, "myoffsetleft").to_i
    block.offsetTop = getPropertyValue(node, "myoffsettop").to_i
    block.width = getPropertyValue(node, "mywidth").to_i
    block.height = getPropertyValue(node, "myheight").to_i
	block.bg_color = getPropertyValue(node, "mybackgroundcolor")
	block.fontsize = getPropertyValue(node, "myfontsize")
	block.fontweight = getPropertyValue(node, "myfontweight")


	#There will be no nil width/height/background color; if nil, assigned parent's width & height as upper bound
	if (block.offsetTop.nil?) && !(parent.nil?)
		block.offsetTop = parent.offsetTop
	elsif !(parent.nil?)
#		if (!@nodeChecker.isInlineNode(block.node)&&block.tag!="h2"&&block.tag!="p")
#			block.offsetTop += parent.offsetTop
#		end
	end
	
	if (block.width.nil?) && !(parent.nil?)
		block.offsetLeft = parent.offsetLeft
	elsif !(parent.nil?)
#		if (!@nodeChecker.isInlineNode(block.node)&&block.tag!="h2"&&block.tag!="p")
#			block.offsetLeft += parent.offsetLeft
#		end
	end
	
	if (block.width.nil?) && !(parent.nil?)
		block.width = parent.width
	end
	if (block.height.nil?) && !(parent.nil?)
		block.height = parent.height
	end
	if (block.bg_color.nil?) && !(parent.nil?)
		block.bg_color = parent.bg_color
	end
	if (block.fontsize.nil?) && !(parent.nil?)
		block.fontsize = parent.fontsize
	end
	if (block.fontweight.nil?) && !(parent.nil?)
		block.fontweight = parent.fontweight
	end

	if !(parent.nil?)
		block.rel_width = (block.width*1.0)/parent.width
		block.rel_height = (block.height*1.0)/parent.height
	else
		block.rel_width = 1.0
		block.rel_height = 1.0
	end
	
	#puts "#{block.rel_width} : #{block.rel_height}"
=begin
	puts  "#{block.tag} : #{block.bg_color}"
	if (block.bg_color.nil?)
		# puts "THIS IS THE TAG!!!!!!!!!!!!!!: #{block.tag}"
		@count = @count + 1
	end
=end
	
	return block
  end
  
  # what is level?
  def divideDOMTree(node, parent, level)
	block = create_block(node, parent, level)
	result = isDividable(block, level)
	
	if (result == DIVIDE)
	  #puts "Block divided"
      if node.respond_to? :each_child 
        node.each_child do |child|
          divideDOMTree(child, block, level)
        end
      end
      	      
	elsif (result == NOT_DIVIDE)
	  unless block.tag.nil?
		#puts "Block added: #{block.tag}"
		@blockPool.addBlock(block)
		if block.node.respond_to? :set_attribute
            #block.node.set_attribute(:style, "border-width: thick; border-style: dashed; border-color: red;")
			# why did you add this id?
			#block.node.set_attribute(:id, "BlockParserBlock")
        end
      end
    end
  end  
  
  def isDividable(block, level)
    heuristicArray = Array.new(13, 0) 
    tag = @nodeChecker.getTagName(block.node)
    inlineNodeFlag = @nodeChecker.isInlineNode(block.node)
    case tag   
    when "div"  # 1, 2, 4, 6, 8, 11
	  heuristicArray[1] = 1
	  heuristicArray[2] = 1
	  heuristicArray[3] = 0
      heuristicArray[4] = 1
      heuristicArray[6] = 1
	  heuristicArray[7] = 0            
      heuristicArray[8] = 1
      heuristicArray[9] = 0   
      heuristicArray[11] = 1     
=begin
    when "table"  # 1, 2, 3, 7, 9, 12
      heuristicArray[1] = 1
      heuristicArray[2] = 1
      heuristicArray[3] = 1
      heuristicArray[7] = 1
      heuristicArray[9] = 1
      heuristicArray[12] = 1
    when "td"     # 1, 2, 3, 4, 8, 9, 10, 12
      heuristicArray[1] = 1
      heuristicArray[2] = 1
      heuristicArray[3] = 1
      heuristicArray[4] = 1
      heuristicArray[8] = 1
      heuristicArray[9] = 1   
      heuristicArray[10] = 1   
      heuristicArray[12] = 1   
    when "tr"     # 1, 2, 3, 7, 9, 12
      heuristicArray[1] = 1
      heuristicArray[2] = 1
      heuristicArray[3] = 1
      heuristicArray[7] = 1
      heuristicArray[9] = 1 
	  heuristicArray[12] = 1
    when "p"      # 1, 2, 3, 4, 5, 6, 8, 9, 11
      heuristicArray[1] = 1
      heuristicArray[2] = 1
      heuristicArray[3] = 1
      heuristicArray[4] = 1
      heuristicArray[5] = 1
      heuristicArray[6] = 1
      heuristicArray[8] = 1
      heuristicArray[9] = 1   
      heuristicArray[11] = 1
=end
	when "script"
=begin	
	else
      if inlineNodeFlag # 1, 2, 3, 4, 5, 6, 8, 9, 11
        heuristicArray[1] = 1
        heuristicArray[2] = 1
        heuristicArray[3] = 1
        heuristicArray[4] = 1
        heuristicArray[5] = 1
        heuristicArray[6] = 1
		heuristicArray[7] = 1            
        heuristicArray[9] = 1
        heuristicArray[10] = 1   
        heuristicArray[12] = 1
=end
      else  #other tags - 1, 2, 3, 4, 6, 8, 9, 11
        heuristicArray[1] = 1
        heuristicArray[2] = 1
        heuristicArray[3] = 0
        heuristicArray[4] = 1
        heuristicArray[6] = 0           
        heuristicArray[8] = 1
        heuristicArray[9] = 1   
        heuristicArray[11] = 1         
      end 
#	end
    
	 result = applyHeuristics(block, heuristicArray)
	return result
   # return applyHeuristics(block, heuristicArray)
  end

=begin
Rule 1	-- DONE
If the DOM node is not a text node and it has no (valid) children, then this node cannot be divided and will be cut.
Why does it matter if it is a text node or not?
=end
  def rule1(block)
    if @nodeChecker.isTextNode(block.node)
      return
    end
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.isValidNode(child)	# haven't written Valid function yet
          return 
        end
      end
    end       
    return FINISHED
  end

=begin
Rule 2	-- DONE
If the DOM node has only one (valid) child and the child is not a text node, then divide this node.
=end
  def rule2(block)
    validChildCount = 0
    textNodeFlag = true
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.isValidNode(child)	# haven't written Valid function yet
          validChildCount += 1
          if validChildCount > 1
            return 
          end
		  textNodeFlag = @nodeChecker.isTextNode(child)
        end
      end
    end
	  
    if validChildCount == 1 && textNodeFlag == false
      return DIVIDE
    end
	
	return    
  end


=begin
Rule 3	-- WRITE THIS
If the DOM node is the root node of the sub-DOM tree, and there is only one sub DOM tree corresponding to this block, divide this node.
=end  
  def rule3(block)
    #TODO: what is sub-DOM tree?
	return
  end


=begin
Rule 4	-- DONE
If all of the child nodes of the DOM node are text nodes or virtual text nodes, do not divide the node.

DoC
* If the font size and font weight of all these child nodes are same, set the DoC of the extracted block to 10.
* Otherwise, set the DoC of this extracted block to 9
=end  
  def rule4(block)
    condition1Flag = true
    condition2Flag = true
    firstTimeFlag = true
	currentFontSize = nil
	currentFontWeight = nil
	
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
	   if (@nodeChecker.isTextNode(child) || @nodeChecker.isVirtualTextNode(child))
          if firstTimeFlag == true
			currentFontSize = getPropertyValue(child, "myfontsize").nil? ? block.fontsize : getPropertyValue(child, "myfontsize")
			currentFontWeight = getPropertyValue(child, "myfontweight").nil? ? block.fontweight : getPropertyValue(child, "myfontweight")
			firstTimeFlag = false
          else    
			fontsize = getPropertyValue(child, "myfontsize").nil? ? block.fontsize : getPropertyValue(child, "myfontsize")
			fontweight = getPropertyValue(child, "myfontweight").nil? ? block.fontweight : getPropertyValue(child, "myfontweight")
			
            if currentFontSize != getPropertyValue(child, "myfontsize") 
              condition2Flag = false
            end
            if currentFontWeight != getPropertyValue(child, "myfontweight") 
              condition2Flag = false
            end            
          end
		else
			condition1Flag = false
			break
		end  
	  end
	end
	  
	if condition1Flag
		if condition2Flag  
          block.doc = 10
        else
		  if (@p_block.doc <= 9)
			block.doc = 9
		  else
			block.doc = 10
		  end
        end
		return NOT_DIVIDE
	end
	
	return
  end

=begin
Rule 5 -- DONE
If one of the child nodes of the DOM node is line-break node, then divide this DOM node.
=end  
  def rule5(block)
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.isLineBreakNode(child)
          return DIVIDE
        end
      end
    end    
  end
 
=begin
Rule 6 -- FIX THIS
If one of the child nodes of the DOM node has HTML tag <HR>, then divide this DOM node.  
=end
  def rule6(block)
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.getTagName(child) == "hr"
          return DIVIDE
        end
      end
    end      
  end

=begin
Rule 7	- DONE
If the background color of this node is different from one of its children's divide this node and at the same time
the child node with different background color will not be divided this round!
=end
  def rule7(block)
	differing_children = Array.new
	
	if block.node.respond_to? :each_child 
      block.node.each_child do |child|
	    if !((currentColor = getPropertyValue(child, "mybackgroundcolor")).nil?)
			if (baseColor != currentColor)
				differing_children.push(child)
			end
		end
	  end	    
    end
	    
	if (differing_children.length > 0)
		if node.respond_to? :each_child 
			node.each_child do |child|
				if ((differing_children.detect {|diff_child| diff_child == child}).nil?)
					divideDOMTree(child, block, level)
				else
					child_block=create_block(child_block,block,10)
					@blockPool.addBlock(child_block)
					if child_block.node.respond_to? :set_attribute
						child_block.node.set_attribute(:style, "border-width: thick; border-style: dashed; border-color: red;")
					end
					# TODO: DOC (6-8) (size, html tag)
					if ((child_block.rel_width < SIZE_THRESHOLD) || (child_block.rel_height <= SIZE_THRESHOLD))
							child_block.doc = @p_block.doc + 1
						else
							child_block.doc = @p_block.doc
					end
				end
			end
		end
		return FINISHED
	end
	return
  end

=begin
Rule 8
If the node has at least one text node child or at least one virtual text node child, and the node's relative size is smaller than a threshold, 
then the node cannot be divided.
=end
  def rule8(block)
    conditionFlag = false
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.isTextNode(child) || @nodeChecker.isVirtualTextNode(child)
          conditionFlag = true
          break
        end
      end    
    end
	
	if (!conditionFlag) 
      return
    end
	
	if ((block.rel_width < SIZE_THRESHOLD) || (block.rel_height <= SIZE_THRESHOLD))
      # TODO: DOC (5-8) (html tag)
	  block.doc = @p_block.doc + 1
      return NOT_DIVIDE
    end
	
	return
  end

=begin
Rule 9 -- DONE
If the child of the node with maximum size are smaller than a threshold, do not divide this node.
=end
  def rule9(block)
    max_width = 0
	max_height = 0
    if block.node.respond_to? :each_child 
		block.node.each_child do |child|
			child_block = create_block(child, block, 10)
			max_width = max_width < child_block.rel_width ? child_block.rel_width : max_width
			max_height = max_height < child_block.rel_height ? child_block.rel_height : max_height
		end
    end

	if ((max_width < SIZE_THRESHOLD) || (max_height <= SIZE_THRESHOLD))
      # TODO: DOC (size, html tag)
	  if ((block.rel_width < SIZE_THRESHOLD) || (block.rel_height <= SIZE_THRESHOLD))
			block.doc = @p_block.doc + 1
	  else
			block.doc = @p_block.doc
	  end
	  	
      return NOT_DIVIDE
    end

	return
  end

=begin
	Rule 10 
	If previous sibling node has not been divided, do not divide this node
=end
  def rule10(block)
	return
  end

=begin
	Rule 11 
	Divide this node.
=end
  def rule11(block)
	return DIVIDE
  end

=begin
Rule 12
Do not divide this node.
=end
  def rule12(block)
	if ((block.rel_width < SIZE_THRESHOLD) || (block.rel_height <= SIZE_THRESHOLD))
		block.doc = @p_block.doc + 1
	else
		block.doc = @p_block.doc
	end
	  
	return NOT_DIVIDE
	#TODO: DOC based on "the html tag and size of the node"
  end

  
end

  