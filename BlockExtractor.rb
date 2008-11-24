require 'rubygems'
require 'hpricot'
require 'NodeChecker'
require 'Block'
require 'BlockPool'

SIZE_THRESHOLD = 100
    
class BlockExtractor
  attr_accessor :blockPool
  
  def initialize()
    @dividable = true
    @nodeChecker = NodeChecker.new
    @blockPool = BlockPool.new
  end
  
  def to_s
    
  end  
  
  #Apply a set of heuristics indicated in the array of 0&1
  def applyHeuristics(block, heuristicArray)
    heuristicArray.each_with_index {|flag, index|
      if flag == 1  # if we need to apply this heuristic
        func = "rule#{index}".to_sym  # make it into symbol so that we can call it
        #puts "#{func} called"
        if self.respond_to? func
          ret = self.send(func, block)
          #puts ret
          if ret == true || ret == false  # if this heuristic determines dividability of this node
            return ret
            # continue otherwise, since this heuristic doesn't work out. 
          end
        end
      end
    }
  end

  def isDividable(block, level)
    #@node = node
    # call the set of rule# methods   
    heuristicArray = Array.new(13, 0) #size 13 (index 0 not used), filled with 0
    tag = @nodeChecker.getTagName(block.node)
    if tag.nil?
      return false
    end
    #puts "current tag: #{tag}"
    inlineNodeFlag = @nodeChecker.isInlineNode(block.node)
    @dividable = case tag   
    
    when "div"
      heuristicArray[1] = 1
      heuristicArray[2] = 1
      heuristicArray[3] = 1
      heuristicArray[4] = 1
      heuristicArray[5] = 1
      heuristicArray[6] = 1      
      heuristicArray[8] = 1
      heuristicArray[9] = 1   
      heuristicArray[11] = 1   
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
    else 
      if inlineNodeFlag # 1, 2, 3, 4, 5, 6, 8, 9, 11
        heuristicArray[1] = 1
        heuristicArray[2] = 1
        heuristicArray[3] = 1
        heuristicArray[4] = 1
        heuristicArray[5] = 1
        heuristicArray[6] = 1      
        heuristicArray[8] = 1
        heuristicArray[9] = 1   
        heuristicArray[11] = 1           
      else  #other tags - 1, 2, 3, 4, 6, 8, 9, 11
        heuristicArray[1] = 1
        heuristicArray[2] = 1
        heuristicArray[3] = 1
        heuristicArray[4] = 1
        heuristicArray[6] = 1      
        heuristicArray[8] = 1
        heuristicArray[9] = 1   
        heuristicArray[11] = 1         
      end
    end    
    
    @dividable = applyHeuristics(block, heuristicArray)
    return @dividable
  end

=begin
Algorithm DivideDomtree(pNode, nLevel)
{
  IF (Dividable(pNode, nLevel) == TRUE){
    FOR EACH child OF pNode {
    DivideDomtree(child, nLevel);
    }
  } ELSE {
    Put the sub-tree (pNode) into the
    pool as a block;
  }
}
=end

  def divideDOMTree(node, level)
    block = Block.new(node, @nodeChecker.getTagName(node))
    block.offsetLeft = getPropertyValue(node, "myoffsetleft")
    block.offsetTop = getPropertyValue(node, "myoffsettop")
    block.width = getPropertyValue(node, "mywidth")
    block.height = getPropertyValue(node, "myheight")
    
    if isDividable(block, level)
      #for terminal(text) nodes, each_child invokes an error!
      if node.respond_to? :each_child 
        node.each_child do |child|
          divideDOMTree(child, level)
        end
      end
      puts "Block divided"
      return true
    else
      unless block.tag.nil?
        puts "Block added: #{block.tag}"
        @blockPool.addBlock(block)
        
        # add a class name of 'block' by manipulating DOM
        if block.node.respond_to? :set_attribute
            #puts "here"
            block.node.set_attribute(:style, "border-width: thick; border-style: dashed; border-color: red;")
            block.node.set_attribute(:id, "BlockParserBlock")
            #html_file = File.new(block.id.to_s+".html", "w")
            #html_file.puts doc.to_html
        end
        
        return false
      end
      
    end
    
  end  

#Set of heuristic rules
# returns either True / False / Nil
# returns nil when current rule cannot determine 
# the dividability of the current node.

  
#Rule 1
#If the DOM node is not a text node and it has no valid children, then this node cannot be divided and
#will be cut.
  
  def rule1(block)
    #puts "rule1 called"
    if @nodeChecker.isTextNode(block.node)
      return
    end
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.isValidNode(child)
          return 
        end
      end
    end       
    return false
  end

#Rule 2 If the DOM node has only one valid child and the child is not a text node, then divide this node.
  
  def rule2(block)
    #puts "rule2 called"
    validChildCount = 0
    textNodeFlag = true
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.isValidNode(child)
          validChildCount += 1
          if validChildCount > 1
            return 
          end
          unless @nodeChecker.isTextNode(child)
            textNodeFlag = false
          end
        end
      end
    end  
    if validChildCount == 1 && textNodeFlag == false
      return true
    end
    return    
  end

#Rule 3
#If the DOM node is the root node of the sub-DOM tree (corresponding to the block), and there is only
#one sub DOM tree corresponding to this block, divide this node.
  
  def rule3(block)
    #TODO: what is sub-DOM tree?
  end

#Rule 4
#If all of the child nodes of the DOM node are text nodes or virtual text nodes, do not divide the node.
#If the font size and font weight of all these child nodes are same, 
#set the DoC of the extracted block to 10.
#Otherwise, set the DoC of this extracted block to 9.
  
  def rule4(block)
    condition1Flag = true
    condition2Flag = true
    firstTimeFlag = true
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
          #puts child.css_path() 
          if firstTimeFlag == true
            currentFontSize = getPropertyValue(child, "myfontsize")
            currentFontWeight = getPropertyValue(child, "myfontweight")              
            firstTimeFlag = false
          else    #make comparisons
            if currentFontSize != getPropertyValue(child, "myfontsize")
              condition2Flag = false
            end
            if currentFontWeight != getPropertyValue(child, "myfontweight")
              condition2Flag = false
            end            
          end
        unless @nodeChecker.isTextNode(child) || @nodeChecker.isVirtualTextNode(child)
          condition1Flag = false
          break
        end
      end
      if condition1Flag
        if condition2Flag  
          block.doc = 10
        else
          block.doc = 9
        end
        return false
      end
    end  
    
    # if there's any sign of font change in children, DoC is 10. Otherwise, it's 9.
#    if block.node.each_child
#      block.doc = 10
#    else
#      block.doc = 9
#    end
    
  end

#Rule 5 If one of the child nodes of the DOM node is line-break node, then divide this DOM node.
  
  def rule5(block)
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.isLineBreakNode(child)
          return true
        end
      end
    end    
  end
 
# Rule 6 If one of the child nodes of the DOM node has HTML tag <HR>, then divide this DOM node
  
  def rule6(block)
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.getTagName(child) == "hr"
          return true
        end
      end
    end      
  end

#Rule 7
# If the background color of this node is different from one of its children’s, 
# divide this node and at the same time, the child node with different 
# background color will not be divided in this round.
# Set the DoC value (6-8) for the child node based on the html tag 
# of the child node and the size of the child node.
  
  def rule7(block)
    baseColor = getPropertyValue(block.node, "mybackgroundcolor")
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if (currentColor = getPropertyValue(child, "mybackgroundcolor")).nil?
          return
        end
        if (baseColor != currentColor)
          result = true
        end
      end    
    end    
    #TODO: how to assign DoC based on html tag?
    #if we don't know the size, there's nothing we can do.
    if (currentSize = getPropertyValue(block.node, "mywidth")).nil?
      return
    end    
    if currentSize < SIZE_THRESHOLD
      block.doc = 7
    end    
    unless result.nil?
      return result
    end
  end

#Rule 8
#If the node has at least one text node child or at least one virtual text node child, 
#and the node's relative size is smaller than a threshold, 
#then the node cannot be divided
#Set the DoC value (from 5-8) based on the html tag of the node
  
  def rule8(block)
    conditionFlag = false
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        if @nodeChecker.isTextNode(child) || @nodeChecker.isVirtualTextNode(child)
          condition1Flag = true
          break
        end
      end    
    end
    unless conditionFlag 
      return
    end
    #if we don't know the size, there's nothing we can do.
    if (currentSize = getPropertyValue(block.node, "mywidth")).nil?
      return
    end
    if currentSize < SIZE_THRESHOLD
      block.doc = 7
      return false
    end
  end

#Rule 9
#If the child of the node with maximum size are small than a threshold (relative size), 
#do not divide this node.
#Set the DoC based on the html tag and size of this node.
  
  def rule9(block)
    currentMaxSize = 0
    newMaxSize = 0
    sizeUnknown = false
    if block.node.respond_to? :each_child 
      block.node.each_child do |child|
        # find the maximum child size
        if (newMaxSize = getPropertyValue(child, "mywidth")).nil?
          sizeUnknown = true
          next
        end
        newMaxSize = newMaxSize.to_i
        currentMaxSize = currentMaxSize < newMaxSize ? newMaxSize : currentMaxSize
      end
    end  
    if sizeUnknown
      return
    end
    if currentMaxSize < SIZE_THRESHOLD
      block.doc = 8
      return false
    end
  end

#Rule 10 If previous sibling node has not been divided, do not divide this node
  
  def rule10(block)
    #puts "rule10 called"
    #return false
  end

#Rule 11 Divide this node.
  
  def rule11(block)
    #puts "rule11 called"
    return true
  end

#Rule 12
#Do not divide this node
#Set the DoC value based on the html tag and size of this node.
  
  def rule12(block)
    #puts "rule12 called"
    #TODO: DoC assignment
    return false
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
end

  
#def getPropertyValue(node, property)
#  unless node.respond_to? :get_attribute
#    return
#  end
#  styleText = node.get_attribute(:style)   
#  s = styleText.to_s.slice(/#{property}:[\s]?\w+/)
#  unless s.nil?      
#    s.tr!(' ', '')
#    return s[property.size()+1, s.length]
#  end
#end