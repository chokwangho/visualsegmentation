class BlockTree
	attr_accessor :root, :xmlString
	
	def initialize(root)
		@root = root
    @xmlString = "<?xml version='1.0' encoding='ISO-8859-1'?>"
	end
	
  def getLabel(node)
    return node.to_s
  end
  
  def getURL(node)
    return node.to_s
  end  
  
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
      writeXML(child)
      }
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