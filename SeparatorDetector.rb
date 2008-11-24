#Separators are horizontal or vertical lines in a web page 
# that visually cross with no blocks in the pool.
# A visual separator is represented by a 2-tuple: (Ps, Pe), 
# where Ps is the start pixel and Pe is the end pixel. 
# The width of the separator is calculated by the difference 
# between these two values.

#1. Initialize the separator list. 
#  The list starts with only one separator (Pbe, Pee) 
#  whose start pixel and end pixel are corresponding to the borders of the pool.
#2. For every block in the pool, the relation of the block with each separator is evaluated
#  a. If the block is contained in the separator, split the separator;
#  b. If the block crosses with the separator, update the separator’s parameters;
#  c. If the block covers the separator, remove the separator.
#3. Remove the four separators that stand at the border of the pool.

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
  DISTANT = 4
  attr_accessor :blockPool
  
  def initialize(blockPool, bodyX, bodyY)
    @blockPool = blockPool
    @separatorList = Array.new
    # The list starts with only one separator (Pbe, Pee) 
    # whose start pixel and end pixel are corresponding 
    # to the borders of the pool.
    separator = Separator.new(0, 0, bodyX, bodyY)
    addSeparator separator
  end
  
  def to_s
    result = ""
    @separatorList.each do |separator|
      result += " #{separator.to_s}"
    end
    puts result    
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
  
  def getStatus (separator, block)
    
    # simplify the coordinate notation
    b_sx, b_sy = block.offsetLeft.to_i, block.offsetTop.to_i
    b_ex, b_ey = block.offsetLeft.to_i + block.width.to_i, block.offsetTop.to_i + block.height.to_i
    s_sx, s_sy = separator.start_x.to_i, separator.start_y.to_i
    s_ex, s_ey = separator.end_x.to_i, separator.end_y.to_i
    
    if s_sy <= b_sy && s_ey >= b_ey
      result = CONTAINING1
    elsif s_sx <= b_sx && s_ex >= b_ex
      result = CONTAINING2     
    elsif s_sy <= b_sy && b_sy <= s_ey && s_ey <= b_ey
      result = CROSSING1
    elsif b_sy <= s_sy && s_sy <= b_ey && b_ey <= s_ey
      result = CROSSING2
    elsif s_sx <= b_sx && b_sx <= s_ex && s_ex <= b_ex
      result = CROSSING3
    elsif b_sx <= s_sx && s_sx <= b_ex && b_ex <= s_ex
      result = CROSSING4
    elsif s_sy >= b_sy && s_ey <= b_ey
      result = COVERING
    elsif s_sx >= b_sx && s_ex <= b_ex
      result = COVERING      
    elsif b_ey <= s_sy || b_sy >= s_ey
      result = DISTANT
    elsif b_ex <= s_sx || b_sx >= s_ex
      result = DISTANT      
    end
    return result
  end
  
  def split(separator, block, status)
    b_sx, b_sy = block.offsetLeft.to_i, block.offsetTop.to_i
    b_ex, b_ey = block.offsetLeft.to_i + block.width.to_i, block.offsetTop.to_i + block.height.to_i
    # update the first separator and create a new one
    if status == CONTAINING1
      newSeparator = Separator.new(separator.start_x, b_ey, separator.end_x, separator.end_y)
      addSeparator newSeparator
      updateSeparator(separator, separator.start_x, separator.start_y, separator.end_x, b_sy)
    elsif status == CONTAINING2
      newSeparator = Separator.new(b_ex, separator.start_y, separator.end_x, separator.end_y)
      addSeparator newSeparator
      updateSeparator(separator, separator.start_x, separator.start_y, b_sx, separator.end_y)
    end 
  end
  
  def crossingUpdate(separator, block, status)
    b_sx, b_sy = block.offsetLeft.to_i, block.offsetTop.to_i
    b_ex, b_ey = block.offsetLeft.to_i + block.width.to_i, block.offsetTop.to_i + block.height.to_i
    if status == CROSSING1
      updateSeparator(separator, separator.start_x, separator.start_y, separator.end_x, b_sy)
    elsif status == CROSSING2
      updateSeparator(separator, separator.start_x, b_ey, separator.end_x, separator.end_y)
    elsif status == CROSSING3
      updateSeparator(separator, separator.start_x, separator.start_y, b_sx, separator.end_y)
    elsif status == CROSSING4
      updateSeparator(separator, b_ex, separator.start_y, separator.end_x, separator.end_y)

    end
  end
  
  def evaluateRelation
#  a. If the block is contained in the separator, split the separator;
#  b. If the block crosses with the separator, update the separator’s parameters;
#  c. If the block covers the separator, remove the separator.  
    @blockPool.each { |block|
      puts block.to_s
      next if block.width.to_i == 0 || block.height.to_i == 0
      @separatorList.each { |separator|
        #to_s
        status = getStatus(separator, block)
        if status == CONTAINING1 || status == CONTAINING2
          split(separator, block, status)
        elsif status == CROSSING1 || status == CROSSING2 || status == CROSSING3 || status == CROSSING4
          crossingUpdate(separator, block, status)
        elsif status == COVERING
          removeSeparator separator
        elsif status == DISTANT
          # do nothing.
        else
          # impossible. do nothing. 
        end
         puts status
      }      
    }
  end
  
  def test
    separator1 = Separator.new(0,0,800,1600)
    addSeparator(separator1)
    separator2 = Separator.new(100,200,300,400)
    addSeparator(separator2)
    to_s
    removeSeparator(separator1)
    to_s
    updateSeparator(separator2,400,400,500,500)
    to_s
  end
end