---
layout: post
title:  "Go lang - API on AWS using Lambda,ApiGateway and DynamoDB"
date:   2021-07-21 21:18:21
categories: programming
tags: featured
image: /assets/article_images/docker-wallpaper-black.jpg
---

### Why Serverless



### Intro 
Before starting to create the API, it is recommended that all AWS services are created and configured correctly.
Obviously, you must first access the AWS dashboard and log in! 😉 The application structure will have three parts:
API Gateway: manages all tasks related to receiving and handling requests for the API.
DynamoDB: non-relational database that will be used to store the information consumed by the API.
Lambda: code to be executed in order to verify the request made, obtain the necessary data, process it and return to the API.
To begin, select the Lambda service, click the Create a function button, give it the name you prefer (here, we'll call it go-serverless-api) and choose Go as the runtime. For this project, we will use a default role: choose Create a new role from template, give it a name (we choose microservice-role) and choose Simple Microservice permissions as the template to be used. On the next page, select the Select a test event input and choose Configure test events. Clicking Create new test event, create an empty body ({}) and name it as you prefer (we chose Blank). READY! Lambda created!

IMAGE

Settings used in the creation of Lambda.
Now, let's create our DynamoDB. Once again, go to the service page, click on Create table, give the table a name (we will use go-serverless-api) and choose your primary key (in this article, we will simply use id).
Image for post
Settings used in creating the DynamoDB table.
Finally, go to the API Gateway service and click Get Started. Choose New API and give your API a name (again, we'll call it go-serverless-api).

IMAGE

Settings used to create the API Gateway.
For this article, we will generate two routes: one to list users and one to create a user. In the Resources screen, click on the resource that already comes by default (/), select Actions and then Create Resource. This will allow us to create a new route for our API. Name your route (we will call / users) and then click on the newly created resource (in this case, / users), click Actions again but this time select Create Method. Select the GET method, choose Lambda function as the type of integration and check the Use Lambda Proxy integration checkbox. Remember to enter the name and region where your Lambda is located. Then repeat the procedure for creating the method, but this time, use the POST method.

IMAGE

Creating a new resource for the API Gateway.

IMAGE

Settings used for the GET / users method.
Ready! Now we have all our infrastructure on AWS ready to run our application, so let's move on to the coolest part: code!

### Coding the application
Superficially, the flow of our application will be:
Receive API Gateway request and check which route was called
Calls the function corresponding to that route
Performs operations on the database
Returns the result for the API Gateway
In Go, a Lambda function will always call main, which should invoke the necessary handler. That is:

{% highlight ruby %}
func main () {
  lambda.Start (handler)
}
{% endhighlight %}

As our application handles two different routes, we will use a router instead of the handler, so that he can decide what to do based on the request route. With that, our main.go file should look like this:

{% highlight go %}
// main.go

package main

import (
  "net / http"

  "github.com/aws/aws-lambda-go/events"
  "github.com/aws/aws-lambda-go/lambda"
)

// handleCreateUser

// handleGetUsers

func router (req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

  if req.Path == "/ users" {
    if req.HTTPMethod == "GET" {
      return handleGetUsers (req)
    }
    if req.HTTPMethod == "POST" {
      return handleCreateUser (req)
    }
  }

  return events.APIGatewayProxyResponse {
    StatusCode: http.StatusMethodNotAllowed,
    Body: http.StatusText (http.StatusMethodNotAllowed),
  }, nil
}

func main () {
  lambda.Start (router)
}
{% endhighlight %}

Basically we will have our main function that
