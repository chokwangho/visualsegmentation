class Separator
  
  attr_accessor :orientation, :start_x, :start_y, :end_x, :end_y, :tl_side, :br_side, :weight
    
  @@id = 0
  def initialize(orientation, sx, sy, ex, ey)
    @@id = @@id + 1 
    @id = @@id  # index starting from 1
    # 0 = Horizontal, 1 = Vertical
	@orientation = orientation
	update(sx, sy, ex, ey)
	@tl_side = Array.new
	@br_side = Array.new
	@weight = 10
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
	tl_size = tl_side.size
	if (orientation == 0)
		for i in 0...tl_size
			if(block.offsetLeft < tl_side[i].offsetLeft)
				tl_side[i,0] = block
			end
			if (i==tl_size-1) && (tl_size==tl_side.size)
				tl_side.push(block)
			end
		end
	else
		for i in 0...tl_size
			if(block.offsetTop < tl_side[i].offsetTop)
				tl_side[i,0] = block
			end
			if (i==tl_size-1) && (tl_size==tl_side.size)
				tl_side.push(block)
			end
		end
	end
	if (tl_size == 0)
		tl_side.push(block)
	end
  end
  
  def add_2_br_side(block)
	br_size = br_side.size
	if (orientation == 0)
		for i in 0...br_size
			if(block.offsetLeft < br_side[i].offsetLeft)
				br_side[i,0] = block
			end
			if (i==br_size-1) && (br_size==br_side.size)
				br_side.push(block)
			end
		end
	else
		for i in 0...br_size
			if(block.offsetTop < br_side[i].offsetTop)
				br_side[i,0] = block
			end
			if (i==br_size-1) && (br_size==br_side.size)
				br_side.push(block)
			end
		end
	end
	if (br_size==0)
		br_side.push(block)
	end
  end
  
  def <=> (y)
	if(orientation==0)
		if(start_y < y.start_y)
			return 1
		elsif (start_y == y.start_y)
			return 0
		else
			return -1
		end
	else
		if(start_x < y.start_x)
			return 1
		elsif (start_x == y.start_x)
			return 0
		else
			return -1
		end
	end
  end


end