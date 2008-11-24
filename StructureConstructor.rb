#The construction process starts from the separators with the lowest
#weight and the blocks beside these separators are merged to form new blocks. 
#This merging process iterates till separators with maximum weights are met. 
#The DoC of each new block is set based on the maximum weight of 
#the separators in the block’s region.
#After that, each leaf node is checked whether it meets the granularity requirement. 
#For every node that fails, we go to the Visual Block Extraction step again 
#to further construct the sub content structure within that node. 
#If all the nodes meet the requirement, the iterative process is then 
#stopped and the vision-based content structure for the whole page is obtained. 
#The common requirement for DoC is that DoC > PDoC, if PDoC is pre-defined.

class StructureConstructor
  def initialze
    
  end
  def to_s
    
  end  
end