class Node
	attr_accessor :label, :parent, :children, :po_num, :mapping

	def initialize(label, parent)
		@label = label
		@parent = parent
		@children = Array.new
		@po_num=nil
		@mapping = nil
	end


end