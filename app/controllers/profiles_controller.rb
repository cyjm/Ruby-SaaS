class ProfilesController < ApplicationController
    
    # GET to /users/:user_id/profile/new
    def new
        # Render blank profile form
        @profile = Profile.new
    end
    
    # POST /users/:user_id/profile
    def create
        # Make sure we have a user filling out forms
        @user = User.find(params[:user_id])
        # Create profile linked to the specific user
        @profile = @user.build_profile( profile_params )
        if @profile.save
            flash[:success] = "Profile updated!"
            redirect_to root_path
        else
            render action: :new
            flash[:warning] = "Sorry, something went wrong."
        end
    end
    
    private
        def profile_params
            params.require(:profile).permit(:first_name, :last_name, :job_title, :phone_num, :contact_email, :description) 
        end
end