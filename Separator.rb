class Separator
  
  attr_accessor :start_x, :start_y, :end_x, :end_y, :tl_side, :br_side  
  @@id = 0
  def initialize(sx, sy, ex, ey)
    @@id = @@id + 1 
    @id = @@id  # index starting from 1
    update(sx, sy, ex, ey)
	@tl_side = Array.new
	@br_side = Array.new
  end
  
  def to_s
    "[#{@id}](#{@start_x},#{@start_y})-(#{@end_x},#{@end_y})"
  end
  
  def id
    @id
  end

  def update(sx, sy, ex, ey)
    @start_x, @start_y, @end_x, @end_y = sx.to_i, sy.to_i, ex.to_i, ey.to_i
  end
  
  def add_2_tl_side(block)
	@tl_side.push(block)
  end
  
  def add_2_br_side(block)
	@br_side.push(block)
  end
end