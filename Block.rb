
class Block
  attr_accessor :doc, :node, :tag, :offsetLeft, :offsetTop, :width, :height
  @@id = 0
  def initialize(node, tag)
    @doc = 0 # degree of coherence
    @node = node  # attached node element (HPricot object)  
    @tag = tag
    @@id = @@id + 1 
    @id = @@id
  end
  
  def to_s
    "[#{@id}]#{@tag}(#{@doc})(#{@offsetLeft},#{@offsetTop}),w:#{@width},h:#{@height}"
  end
  
  def id
    @id
  end
  
  
end
