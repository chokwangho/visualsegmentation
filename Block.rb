
class Block
  attr_accessor :node, :doc, :tag, :offsetLeft, :offsetTop, :width, :height, :rel_width, :rel_height, :bg_color, :fontsize, :fontweight, :parent, :children, :separators, :orientation, :po_num, :mapping
  @@id = 0
  def initialize(node, tag)
    @doc = 0 # degree of coherence
    @node = node  # attached node element (HPricot object)  
    @tag = tag
    @@id = @@id + 1 
    @id = @@id
	@parent = nil
	@children = Array.new
	@separators = Array.new # 0 - 4 {top, left, bottom, right}
	@orientation = 1
	
	@po_num=nil
	@mapping=nil
  end
  
  def to_s
    "[#{@id}]#{@tag}(#{@doc})(#{@offsetLeft},#{@offsetTop}),w:#{@width},h:#{@height}"
  end
  
  def id
    @id
  end
  
  def <=> (y)
	if(orientation==0)
		if(offsetTop < y.offsetTop)
			return 1
		elsif (offsetTop == y.offsetTop)
			if(offsetLeft < y.offsetLeft)
				return 1
			elsif (offsetLeft == y.offsetLeft)
				return 0
			else
				return -1
			end
		else
			return -1
		end
	else
		if(offsetLeft < y.offsetLeft)
			return 1
		elsif (offsetLeft == y.offsetLeft)
			if(offsetTop < y.offsetTop)
				return 1
			elsif (offsetTop == y.offsetTop)
				return 0
			else
				return -1
			end
		else
			return -1
		end
	end
  end

  
end
