require 'BlockPool'
require 'Separator'

class SeparatorDetector 
  # define constants
  CONTAINING1 = 11
  CONTAINING2 = 12
  CROSSING1 = 21
  CROSSING2 = 22
  CROSSING3 = 23
  CROSSING4 = 24  
  COVERING = 3
  DISTANT = 4	# Doesn't touch
  
  attr_accessor :blockPool, :separatorList, :bodyX, :bodyY
  
  def initialize(blockPool, bodyX, bodyY)
    @blockPool = blockPool
    @separatorList = Array.new
    @verticalSeparatorList = Array.new
    @horizontalSeparatorList = Array.new
	
    # The list starts with only one separator (Pbe, Pee) 
    # whose start pixel and end pixel are corresponding 
    # to the borders of the pool.
	bodyY=5000
    @bodyX, @bodyY = bodyX, bodyY
    separator = Separator.new(0, 0, bodyX, bodyY)
    addHorizontalSeparator separator
    addVerticalSeparator separator
  end
  
  def to_s
    result = ""
    @separatorList.each do |separator|
      result += " #{separator.to_s}"
    end
    puts result    
  end

  def addHorizontalSeparator(separator)
    @horizontalSeparatorList.push separator
  end  
  
  def removeHorizontalSeparator(separator)
    @horizontalSeparatorList.delete separator
  end
  
  def updateHorizontalSeparator(separator, sx, sy, ex, ey)
    @horizontalSeparatorList.each_with_index { |element, index|
      if element == separator
        @horizontalSeparatorList[index].update(sx, sy, ex, ey)
      end
    }
  end  
   
  def addVerticalSeparator(separator)
    @verticalSeparatorList.push separator
  end  
  
  def removeVerticalSeparator(separator)
    @verticalSeparatorList.delete separator
  end
  
  def updateVerticalSeparator(separator, sx, sy, ex, ey)
    @verticalSeparatorList.each_with_index { |element, index|
      if element == separator
        @verticalSeparatorList[index].update(sx, sy, ex, ey)
      end
    }
  end    
  
  def getHorizontalStatus (separator, block)
    # simplify the coordinate notation
    b_sy = block.offsetTop
    b_ey = block.offsetTop + block.height
    s_sy = separator.start_y
    s_ey = separator.end_y
    
	puts "#{s_sy} : #{b_sy} : #{s_ey} : #{b_ey} "

    if s_sy <= b_sy && s_ey >= b_ey
      result = CONTAINING1
    elsif s_sy < b_sy && b_sy <= s_ey && s_ey < b_ey
      result = CROSSING1
    elsif b_sy < s_sy && s_sy <= b_ey && b_ey < s_ey
      result = CROSSING2
    elsif s_sy >= b_sy && s_ey <= b_ey
      result = COVERING  
    elsif b_ey < s_sy || b_sy > s_ey
      result = DISTANT     
    end
    return result
  end

  def getVerticalStatus (separator, block)    
    # simplify the coordinate notation
    b_sx = block.offsetLeft
    b_ex = block.offsetLeft + block.width
    s_sx = separator.start_x
    s_ex = separator.end_x
    
#	puts "#{s_sx} : #{b_sx} : #{s_ex} : #{b_ex} "
	
    if s_sx <= b_sx && s_ex >= b_ex
      result = CONTAINING2     
    elsif s_sx < b_sx && b_sx <= s_ex && s_ex < b_ex
      result = CROSSING3
    elsif b_sx < s_sx && s_sx <= b_ex && b_ex < s_ex
      result = CROSSING4
    elsif s_sx >= b_sx && s_ex <= b_ex
      result = COVERING      
    elsif b_ex < s_sx || b_sx > s_ex
      result = DISTANT      
    end
    return result
  end
  
  def split(separator, block, status)
    b_sx, b_sy = block.offsetLeft, block.offsetTop
    b_ex, b_ey = block.offsetLeft + block.width, block.offsetTop + block.height
    # update the first separator and create a new one
	newSeparator = nil
    if status == CONTAINING1
      newSeparator = Separator.new(separator.start_x, b_ey, separator.end_x, separator.end_y)
      addHorizontalSeparator newSeparator
      updateHorizontalSeparator(separator, separator.start_x, separator.start_y, separator.end_x, b_sy)
    elsif status == CONTAINING2
      newSeparator = Separator.new(b_ex, separator.start_y, separator.end_x, separator.end_y)
      addVerticalSeparator newSeparator
      updateVerticalSeparator(separator, separator.start_x, separator.start_y, b_sx, separator.end_y)
    end 
	newSeparator.add_2_tl_side(block)
    separator.add_2_br_side(block)
  end
  
  def crossingUpdate(separator, block, status)
    b_sx, b_sy = block.offsetLeft.to_i, block.offsetTop.to_i
    b_ex, b_ey = block.offsetLeft.to_i + block.width.to_i, block.offsetTop.to_i + block.height.to_i
    if status == CROSSING1
      updateHorizontalSeparator(separator, separator.start_x, separator.start_y, separator.end_x, b_sy)
	  separator.add_2_br_side(block)
    elsif status == CROSSING2
      updateHorizontalSeparator(separator, separator.start_x, b_ey, separator.end_x, separator.end_y)
	  separator.add_2_tl_side(block)
    elsif status == CROSSING3
      updateVerticalSeparator(separator, separator.start_x, separator.start_y, b_sx, separator.end_y)
	  separator.add_2_br_side(block)
    elsif status == CROSSING4
      updateVerticalSeparator(separator, b_ex, separator.start_y, separator.end_x, separator.end_y)
	  separator.add_2_tl_side(block)
    end
  end
  
  def evaluateRelation
    #horizontal 
    @blockPool.each { |block|
      puts block.to_s
      next if block.width.to_i == 0 || block.height.to_i == 0
	  size_h = @horizontalSeparatorList.size
	  for i in 0...size_h
	    separator = @horizontalSeparatorList[i]
        status = getHorizontalStatus(separator, block)
        if status == CONTAINING1 || status == CONTAINING2
          split(separator, block, status)
        elsif status == CROSSING1 || status == CROSSING2 || status == CROSSING3 || status == CROSSING4
          crossingUpdate(separator, block, status)
        elsif status == COVERING
          removeHorizontalSeparator separator
        end
         puts status
      end      
    }
    
	#vertical
    @blockPool.each { |block|
      puts block.to_s
      next if block.width.to_i == 0 || block.height.to_i == 0
	  size_v = @verticalSeparatorList.size
	  for i in 0...size_v
		separator = @verticalSeparatorList[i]
        #to_s
        status = getVerticalStatus(separator, block)
        if status == CONTAINING1 || status == CONTAINING2
          split(separator, block, status)
        elsif status == CROSSING1 || status == CROSSING2 || status == CROSSING3 || status == CROSSING4
          crossingUpdate(separator, block, status)
        elsif status == COVERING
          removeVerticalSeparator separator
        end
         puts status
      end      
    }    
    
    @separatorList.concat(@horizontalSeparatorList)
    @separatorList.concat(@verticalSeparatorList)
    
    # Remove the four separators that stand at the border of the pool.
    removeBorders    
    to_s
  end

# Remove the four separators that stand at the border of the pool.  
  def removeBorders
    @separatorList.each_with_index { |element, index|
      if element.start_x == 0 && element.start_y == 0
        removeSeparator(element)
      elsif element.end_x == @bodyX && element.end_y == @bodyY
        removeSeparator(element)
      end
    }
  end
  
  # FIND A BETTER WAY TO DRAW SEPARATORS
  def drawSeparators(doc, body)
    html = ""
    @separatorList.each_with_index { |element, index|
      width = element.end_x.to_i - element.start_x.to_i
      height = element.end_y.to_i - element.start_y.to_i
      #html = html + "<div offsetLeft='" + element.start_x.to_s + "' offsetTop='" + element.start_y.to_s + "'"
      #html = html + " width='" + width.to_s + "' height='" + height.to_s + "'"
      html = html + "<div style='left:" + element.start_x.to_s + "px; top:" + element.end_y.to_s + "px;width:" + width.to_s
      html = html + "px;height:" + "10"
      html = html + "px;background-color:gray;border:0px;z-index:400000;position:absolute;float:center;!important'></div>"
    }
    #puts html
    body.append(html)   
  end
  
  #TODO: FIGURE OUT HOW TO ASSIGN WEIGHTS
  def assignWeights
      
  end
  
  def addSeparator(separator)
    @separatorList.push separator
  end  
  
  def removeSeparator(separator)
    @separatorList.delete separator
  end
  
  def updateSeparator(separator, sx, sy, ex, ey)
    @separatorList.each_with_index { |element, index|
      if element == separator
        @separatorList[index].update(sx, sy, ex, ey)
      end
    }
  end  

end