class ProfilesController < ApplicationController
    
    # GET to /users/:user_id/profile/new
    def new
        # Render blank profile form
        @profile = Profile.new
    end
    
    # POST to /users/:user_id/profile
    def create
        # Make sure we have a user filling out forms
        @user = User.find(params[:user_id])
        # Create profile linked to the specific user
        @profile = @user.build_profile( profile_params )
        if @profile.save
            flash[:success] = "Profile updated!"
            redirect_to user_path( params[:user_id] )
        else
            render action: :new
            flash[:warning] = "Sorry, something went wrong, please try again."
        end
    end
    
    # GET to /users/:user_id/profile/edit
    def edit
        @user = User.find( params[:user_id] )
        @profile = @user.profile
    end
    
    # PUT to /users/:user_id/profile/
    def update
        @user = User.find( params[:user_id] )
        @profile = @user.profile
        # Mass assign edited profile attributes and update
        if @profile.update_attributes(profile_params)
            flash[:success] = "Profile has been updated!"
            # Redirect user to their profile page
            redirect_to user_path(id: params[:user_id])
        else
            flash[:warning] = "Sorry, something went wrong, please try again."
            render action: :edit
        end
    end
    
    private
        def profile_params
            params.require(:profile).permit(:first_name, :last_name, :avatar, :job_title, :phone_num, :contact_email, :description) 
        end
end