class BlockPool

  def initialize
    @blockPool = Array.new
  end
  
  def to_s
    result = ""
    @blockPool.each do |block|
      result += " #{block.to_s}"
    end
    puts result
  end
  
  def addBlock(block)
    @blockPool.push block
  end
  
  def removeBlock(block)
    @blockPool.delete block
  end
  
  def each  # for block traversal outside the class
    @blockPool.each {|x| yield x}
  end
end