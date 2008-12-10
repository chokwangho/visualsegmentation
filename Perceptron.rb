require 'BlockTree'

class T_input
	attr_accessor :t_1, :t_2, :alignment

	def initialize (t_1, t_2)
		@t_1=t_1
		@t_2=t_2
		@alignment=alignment
	end
end

=begin
Example code for Main.rb (training on one example)
....
p = Perceptron.new
p.training_list.push(e1)
p.Generalized_Perceptron
....
=end

# define an alignment class
# edit Compute_Edit_Distance, to take @w into account & return an alignment struct
# write Compute_Feature_Vector

class Perceptron 
	FEATURE_SIZE = 3
	T = 20
	
	attr_accessor :training_list, :w, 
	# just push onto training_list
	
	def initialize
		@training_list=Array.new
		@w = Array.new(FEATURE_SIZE,0)
	end

	def Generalized_Perceptron
		# pick a training example
		for t_index in 0...training_list.size
			t_1 = @training_list[t_index].t_1
			t_2 = @training_list[t_index].t_2
			target_feature = Compute_Feature_Vector(@training_list[t_index])
			
			for t in 0...T 
				# y^hat = arg max_{y in Y} [ w^T F(x(i), y) ]
				current_alignment = t_1.Compute_Edit_Distance(t_2, @w)
				current_feature = Compute_Feature_Vector(current_alignment)
				
				# update w
				for i in 0...FEATURE_SIZE
					@w[i] += (1.0/t)*(target_feature[i]-current_feature[i])
				end	 
			end
		end
		
		puts @w
	end
	
	def Compute_Feature_Vector(alignment)
	
	
	end
	
	def Predict_Alignment(t_1, t_2)
		return t_1.Compute_Edit_Distance(t_2, @w)
	end
end
