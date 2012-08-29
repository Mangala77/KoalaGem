class HomeController < ActionController::Base
require 'RMagick'
require 'bitly'
  protect_from_forgery
 # before_filter :login_to_facebook,:only => [:upload]
  
   def index 
    session[:oauth] = Koala::Facebook::OAuth.new(APP_ID, APP_SECRET, SITE_URL + '/home/callback')
    @auth_url = session[:oauth].url_for_oauth_code(:permissions=>"read_stream,publish_stream") 	
		puts session.to_s + "<<< session"
  end


   def callback
 
      if params[:code]
  		# acknowledge code and get access token from FB
          session[:access_token] = session[:oauth].get_access_token(params[:code])
	end
     
   end


def upload
puts "mmm"
p params[:form][:body]

  #file_field = @params['form']['file'] rescue nil
  # file_field is a StringIO object
 # file_field.content_type # 'text/csv'
 # file_field.full_original_filename
 name = params[:form][:file].original_filename
    directory = "public/images/upload"
    path = File.join(directory, name)
    File.open(path, "wb") { |f| f.write(params[:form][:file].read) }
    #flash[:notice] = "File uploaded"
    #redirect_to "/upload/new"

# auth established, now do a graph call:
	@api = Koala::Facebook::API.new(session[:access_token])
Bitly.use_api_version_3
bitly = Bitly.new('mangalamelkunde','R_71fc4128d2c9d4f207cf07dcae6850ce')
page_url = bitly.shorten('http://10.0.11.104:3000/images/upload/'+params[:form][:file].original_filename)
short_url = page_url.short_url
	begin
            @clown = Magick::ImageList.new("public/images/upload/"+params[:form][:file].original_filename)
                         @clown_id = StringIO.open(@clown.to_blob) do |strio|
				response = @api.put_picture(strio, "image/jpeg",{:message => "#{params[:form][:description]}"+short_url})
				response['id']
                        end

                        @picture_url = @api.get_picture(@clown_id) #if want to sent in album

    
          
                   #@picture_url = @api.get_picture(@clown_id ) 

	rescue Exception=>ex
		#puts ex.message
	end
		
  
 	respond_to do |format|
        format.html {   }	
       end

 end
def login_to_facebook

    session[:oauth] = Koala::Facebook::OAuth.new(APP_ID, APP_SECRET, SITE_URL + '/home/callback')
    @auth_url = session[:oauth].url_for_oauth_code(:permissions=>"read_stream,publish_stream") 	
		puts session.to_s + "<<< session"
   
end


end

