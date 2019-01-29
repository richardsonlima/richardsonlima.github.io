---
layout: post
title:  "Docker resource limits"
date:   2019-01-27 20:13:21
categories: programming
tags: featured
image: /assets/article_images/docker-wallpaper-black.jpg
---

Similar as we can set resources limits on Kubernete’s Cluster, we can (and should) do the same thing on Docker. A container without limitations can eventually use all of the CPU, memory and have access to all of the resources on the Docker host or Swarm Cluster,  and it can potentially starve on processes and resources. On this article I’ll show you how to setup Docker resources limits, in order to avoid things like that. 

### Working with container memory limit

While starting up a container using the run command, we can specify some options to limit the memory usage using the –memory flag. The amount of memory that the container is going to be limited can be assigned in either bytes (b), kylobytes (k), megabytes(m) or gigabytes (g). In the example below I’m starting up a container with a 256 megabytes RAM maximum usage limitation, and another one with 1 gigabyte.

{% highlight ruby %}
   $ sudo docker run -d -p 8081:80 --memory="256m" nginx
   $ sudo docker run -it --memory="1g" alpine /bin/bash
{% endhighlight %}

There’s also the option to limit the amount of swap memory available. To do this, use the flag –memory-swap. In the exemple below we’ll limit the memory usage to 1024m and the swap to 2g.

{% highlight ruby %}
   $ sudo docker run -d -p 8081:80 --memory="1024m" --memory-swap"2g" alpine
{% endhighlight %}

### Working with contaimer cpu limit

{% highlight ruby %}
   $ sudo docker run -d -p 8081:80 --memory="1024m" --memory-swap"2g" --cpus=".7" alpine
{% endhighlight %}

Our container can now use 1024MB (1G) of memory, 2G of swap memory and 70000. If we rather limit the amount of CPU shares (which by default if 1024MB), increasing and decreasing it and allowing container to use a greater or lesser portion of host machine cpu cycles
	
### Conclusion

> " Deploying new containers has become ridiculously easy (In a good way). Once containers are running, it is even easier to scale. 
> Doubling or even tripling the number of running containers can occur with a simple keystroke but can your container infrastructure handle it?
> Much like cars driving on a freeway. All the cars have different shapes, sizes, and performance. Cars are limited to the capacity of the road.
> Freeways are static in size and cannot shrink or grow based on demand (yet). Adding more vehicles to a freeway will eventually lead to a bottleneck.
> That is why we have laws in place to help the flow of traffic like no stopping, speed limits, etc. " - https://bit.ly/2FTK4Nk

Check out the [docker-resource-limits][docker-resource-limits] official documentation about docker resource limits 

[docker-resource-limits]: https://docs.docker.com/config/containers/resource_constraints/