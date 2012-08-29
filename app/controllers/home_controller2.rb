class HomeController < ActionController::Base
require 'RMagick'

  protect_from_forgery
  
   def index   
   	session[:oauth] = Koala::Facebook::OAuth.new(APP_ID, APP_SECRET, SITE_URL + '/home/callback')
		@auth_url =  session[:oauth].url_for_oauth_code(:permissions=>"read_stream,publish_stream") 	
		puts session.to_s + "<<< session"

  	respond_to do |format|
			 format.html {  }
		 end
  end

	def callback

  	if params[:code]
  		# acknowledge code and get access token from FB
		  session[:access_token] = session[:oauth].get_access_token(params[:code])
                   
		end		

		 # auth established, now do a graph call:
		  
		@api = Koala::Facebook::API.new(session[:access_token])
                @graph = session[:oauth].url_for_oauth_code(:permissions=>"read_stream,publish_stream")

		begin
                      
                        @clown = Magick::ImageList.new("public/images/beautiful.jpg")
                         @clown_id = StringIO.open(@clown.to_blob) do |strio|
				response = @api.put_picture(strio, "image/jpeg")
				response['id']
                        end

                        @picture_url = @api.get_picture(@clown_id) #if want to sent in album
			#@graph_data = @api.get_object("/me/statuses", "fields"=>"message")  ## for fetching data
                        @api.put_wall_post("This a test", {"picture" => @picture_url})
			
		rescue 
		   @response= "Image posted"
		end
 		respond_to do |format|
		 format.html {   }			 
		end
		
	
	end
end

