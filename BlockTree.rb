require "Tree.rb"

class Alignment
	attr_accessor :match, :insert, :delete	
	def initialize
		@match = Hash.new
		@insert = Array.new
		@delete = Array.new
	end
end

class BlockTree
	attr_accessor :root, :xmlString, :post_order_list, :leftmost_leaf, :key_roots, :tree_dist, :dist_mats
	
	def initialize(root)
		@root = root
		@xmlString = "<?xml version='1.0' encoding='ISO-8859-1'?>"
		
		# tree distance initializers
		@tree_dist = nil
		@dist_mats = nil
		@post_order_list = Array.new
	    @leftmost_leaf = Array.new
		@key_roots = Array.new
		
		if !(@root.nil?)
			Preprocess(@root, 1)
		end
	end
	
	def getLabel(node)
		return node.to_s
	end
  
  def getURL(node)
    filename = "../html/snippet_" + node.id.to_s + ".html"
    return filename
  end  
	
	# TREE-EDIT DISTANCE FUNCTIONS BEGIN		
	def Compute_Edit_Distance(other_tree, w)
		num_mats = @key_roots.size
		@dist_mats = Array.new(num_mats)
		@dist_mats[0]=Array.new(@post_order_list.size)
		for i in 0...@post_order_list.size
			@dist_mats[0][i]=Array.new(other_tree.post_order_list.size)
			for j in 0...other_tree.post_order_list.size
				@dist_mats[0][i][j]=Cell.new
			end
		end
		@tree_dist=@dist_mats[0] # for easier reference
		
		curr_matrix_index=1
		for i in 0...@key_roots.size
			for j in 0...other_tree.key_roots.size
				Tree_Distance(@key_roots[i].po_num, other_tree.key_roots[j].po_num, other_tree, curr_matrix_index, w)
				curr_matrix_index+=1
			end
		end
		
		#FOR DEBUGGING
		puts "Final tree_dist"
		for i in 0...@post_order_list.size
			str = ""
			for j in 0...other_tree.post_order_list.size
				str = str + @tree_dist[i][j].cost.to_s + " "
			end
			puts str
		end
		
		puts ""
		
		puts "Mappings"
		a = Alignment.new
		Mapping(@tree_dist[@post_order_list.size-1][other_tree.post_order_list.size-1].back_ptrs[0], a)
		return a
	end
	
	def Tree_Distance(i, j, other_tree, curr_matrix_index, w)
		trip = nil
		
		# initialize forest dist matrix for this round
		num_rows, num_cols = i-@leftmost_leaf[i-1].po_num+2, j-other_tree.leftmost_leaf[j-1].po_num+2
		@dist_mats[curr_matrix_index]=Array.new(num_rows)
		for i_1 in 0...num_rows
			@dist_mats[curr_matrix_index][i_1]=Array.new(num_cols)
			for j_1 in 0...num_cols
				@dist_mats[curr_matrix_index][i_1][j_1]=Cell.new
			end
		end
		forest_dist = @dist_mats[curr_matrix_index]	# for easier reference
		
		# base cases -- want to insert real costs later
		forest_dist[0][0].cost=0
		for i_1 in 1...num_rows
			forest_dist[i_1][0].cost=forest_dist[i_1-1][0].cost+1;
			trip=Triple.new(curr_matrix_index, i_1-1, 0)
			forest_dist[i_1][0].back_ptrs.push(trip)
			forest_dist[i_1][0].mapping[0]=i_1
			
		end
		for j_1 in 1...num_cols
			forest_dist[0][j_1].cost=forest_dist[0][j_1-1].cost+1;
			trip=Triple.new(curr_matrix_index, 0, j_1-1)
			forest_dist[0][j_1].back_ptrs.push(trip)
			forest_dist[0][j_1].mapping[1]=j_1
		end
		
		#the meat
		for i_1 in 1...num_rows
			for j_1 in 1...num_cols
				#maps forest_dist indices back to tree_dist indices
				t1_index=@leftmost_leaf[i-1].po_num+i_1-2
				t2_index=other_tree.leftmost_leaf[j-1].po_num+j_1-2
				first, second, third = nil, nil, nil
				
				
				if(@leftmost_leaf[t1_index]==@leftmost_leaf[i-1] && 
					other_tree.leftmost_leaf[t2_index]==other_tree.leftmost_leaf[j-1])
					forest_dist[i_1][j_1].cost=
					Max(first=forest_dist[i_1-1][j_1].cost+w[0],
						second=forest_dist[i_1][j_1-1].cost+w[0],
						third=(forest_dist[i_1-1][j_1-1].cost+Cost(t1_index,t2_index,other_tree, w)));
					
					#save back pts to determine mapping
					if (forest_dist[i_1][j_1].cost==third) 
						trip=Triple.new(curr_matrix_index, i_1-1, j_1-1)
						forest_dist[i_1][j_1].back_ptrs.push(trip)
						forest_dist[i_1][j_1].mapping[0]=i_1
						forest_dist[i_1][j_1].mapping[1]=j_1
					elsif (forest_dist[i_1][j_1].cost==first) 
						trip=Triple.new(curr_matrix_index, i_1-1, j_1)
						forest_dist[i_1][j_1].back_ptrs.push(trip)
						forest_dist[i_1][j_1].mapping[0]=i_1
					elsif (forest_dist[i_1][j_1].cost==second) 
						trip=Triple.new(curr_matrix_index, i_1, j_1-1);
						forest_dist[i_1][j_1].back_ptrs.push(trip)
						forest_dist[i_1][j_1].mapping[1]=j_1
					end
					
					@tree_dist[t1_index][t2_index].cost=forest_dist[i_1][j_1].cost
					trip=Triple.new(curr_matrix_index, i_1, j_1)
					@tree_dist[t1_index][t2_index].back_ptrs.push(trip)
				else
					forest_dist[i_1][j_1].cost=
					Max(first=forest_dist[i_1-1][j_1].cost+w[0],
						second=forest_dist[i_1][j_1-1].cost+w[0],
						third=(forest_dist[@leftmost_leaf[t1_index].po_num-@leftmost_leaf[i-1].po_num][other_tree.leftmost_leaf[t2_index].po_num-leftmost_leaf[j-1].po_num].cost+@tree_dist[t1_index][t2_index].cost));
						
					#save back ptrs to determine mapping
					if (forest_dist[i_1][j_1].cost==first) 
						trip=Triple.new(curr_matrix_index, i_1-1, j_1) 
						forest_dist[i_1][j_1].back_ptrs.push(trip)
						forest_dist[i_1][j_1].mapping[0]=i_1
					elsif (forest_dist[i_1][j_1].cost==second) 
						trip=Triple.new(curr_matrix_index, i_1, j_1-1)
						forest_dist[i_1][j_1].back_ptrs.push(trip)
						forest_dist[i_1][j_1].mapping[1]=j_1
					elsif (forest_dist[i_1][j_1].cost==third) 
						forest_dist[i_1][j_1].mapping[0]=i_1
						forest_dist[i_1][j_1].mapping[1]=j_1
						trip=Triple.new(curr_matrix_index, @leftmost_leaf[t1_index].po_num-@leftmost_leaf[i-1].po_num, other_tree.leftmost_leaf[t2_index].po_num-other_tree.leftmost_leaf[j-1].po_num) 
						forest_dist[i_1][j_1].back_ptrs.push(trip)
						trip=Triple.new(0, t1_index, t2_index) 
						forest_dist[i_1][j_1].back_ptrs.push(trip)
					end		
				end
			end
		end	
	end
	
	def Cost(i,j,other_tree, w)
		cost = 0
		#tag, doc, rel_offsetLeft, rel_offsetTop, rel_width, rel_height
		if (@post_order_list[i].tag==other_tree.post_order_list[j].tag)
			cost += w[1]
		end
		
		if ((@post_order_list[i].doc-other_tree.post_order_list[j].doc).abs < 2)
			cost += w[2]
		end
		
		rel = (@post_order_list[i].offsetLeft < other_tree.post_order_list[j].offsetLeft) ? @post_order_list[i].offsetLeft/(other_tree.post_order_list[j].offsetLeft*1.0) : other_tree.post_order_list[j].offsetLeft/(@post_order_list[i].offsetLeft*1.0)
		if (rel >= 0.9)
			cost += w[3]
		end
		
		rel = (@post_order_list[i].offsetTop < other_tree.post_order_list[j].offsetTop) ? @post_order_list[i].offsetTop/(other_tree.post_order_list[j].offsetTop*1.0) : other_tree.post_order_list[j].offsetTop/(@post_order_list[i].offsetTop*1.0)
		if (rel >= 0.9)
			cost += w[4]
		end
		
		rel = (@post_order_list[i].width < other_tree.post_order_list[j].width) ? @post_order_list[i].width/(other_tree.post_order_list[j].width*1.0) : other_tree.post_order_list[j].width/(@post_order_list[i].width*1.0)
		if (rel >= 0.9)
			cost += w[5]
		end

		rel = (@post_order_list[i].height < other_tree.post_order_list[j].height) ? @post_order_list[i].height/(other_tree.post_order_list[j].height*1.0) : other_tree.post_order_list[j].height/(@post_order_list[i].height*1.0)	
		if (rel >= 0.9)
			cost += w[6]
		end	
		
		if (cost == 0)
			cost = w[7]
		end
		
		return cost
	end
	
	def Mapping(t, a) 
	 m = t.m_index
	 i = t.i_index
	 j = t.j_index
	 c = @dist_mats[m][i][j]
		for k in 0...c.back_ptrs.size	
			if (!(c.mapping[0].nil? && c.mapping[1].nil?))
				if(c.mapping[1].nil?)
					puts "DELETE from T1: #{c.mapping[0]}"
					a.delete = f.delete | [c.mapping[0]]
				elsif (c.mapping[0].nil?)
					puts "INSERT from T2: #{c.mapping[1]}"
					a.insert = f.insert | [c.mapping[1]]
				else
					puts "T1: #{c.mapping[0]} is mapped to T2: #{c.mapping[1]}"
					a.match[c.mapping[0]]=c.mapping[1]
				end
			end
			Mapping(c.back_ptrs[k], a)
		end
	end
	
	def Preprocess(node, num)
		for i in 0...node.children.size
			num=Preprocess(node.children[i], num)
		end
		
		node.po_num=num
		@post_order_list.push(node)
		@leftmost_leaf.push(Leftmost_Leaf(node))
		if(Is_Key_Root(node))
			@key_roots.push(node)
		end
		return num+1
	end
	
	def Leftmost_Leaf(node)
		if(node.children.size==0)
			return node
		end
		return Leftmost_Leaf(node.children[0])
	end
	
	def Is_Key_Root(node)
		if(node==@root)
			return true
		elsif (node.parent.children[0]!=node) 
			return true
		else
			return false
		end
	end
	
	def Max(a, b, c)
		max=nil
		
		if(a >= b) 
			max=a
		else 
			max=b
		end
		
		if(max >= c) 
			return max
		else 
			return c
		end
	end
	
	# TREE-EDIT DISTANCE FUNCTIONS END

  
  def writeXML(node)
    if node.nil?
      puts "NIL"
      return
    end
    @xmlString = @xmlString + "<node><label><![CDATA["
    @xmlString = @xmlString + getLabel(node)
    @xmlString = @xmlString + "]]></label><url><![CDATA["
    @xmlString = @xmlString + getURL(node)
    @xmlString = @xmlString + "]]></url><children>"
    
		if node.children.respond_to? :each_with_index
			node.children.each_with_index{ |child, index|
			writeXML(child)}
		end

		@xmlString = @xmlString + "</children></node>"
	end
  
	def write_2_xml(file)
		writeXML(root)
		xml_file = File.new(file, "w")
		xml_file.puts @xmlString
		puts @xmlString
	end
end