class ContactsController < ApplicationController
    # GET request to /contact-us
    # shows new contact form
    def new
        @contact = Contact.new
    end
    
    # POST request /contacts
    def create
        # Mass assignment of form fields into Contact object
        @contact = Contact.new(contact_params)
        # Save the Contact object to the db
        if @contact.save
            #Store form fields via params into vars
            name  =  params[:contact][:name]
            email =  params[:contact][:email]
            body  =  params[:contact][:comments]
            # Plug vars into Contact Mailer
            # email method and send email
            ContactMailer.contact_email(name, email, body).deliver
            # store success message in flash hash
            # redirect to the new action
            flash[:success] = "Message sent."
            redirect_to new_contact_path
        else
            # if Contact object doesn't save, store error in flash hash
            # and redirect to tne new action
            flash[:danger] = @contact.errors.full_messages.join(", ")
            redirect_to new_contact_path
        end
    end
    
    private
        # for collection of data from the form use
        # strong parameters and white list for the form fields
        def contact_params
            params.require(:contact).permit(:name, :email, :comments)
        end
end