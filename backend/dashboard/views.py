from django.shortcuts import render

# Make sure the name matches exactly: home_view
def home_view(request):
    return render(request, 'home.html')