---
layout: post
title:  "Docker resource limits"
date:   2018-08-19 20:13:21
categories: programming
tags: featured
image: /assets/article_images/docker-wallpaper-black.jpg
---

Similar as we've resource limits on Kubernetes Cluster we've the same think on Docker, a container without limits can use all of cpu, memory and will have access on all resources on Docker host or Swarm Cluster, it can potentially `starving` on process and resources, to avoid it, on this article we'll understand how to setup docker resource limits  
 

Working with contaimer memory limit

While startup a container using `run` command we can specify some options to limit memory usage following these suffix b,k,m,g. 

E.g:

{% highlight ruby %}
   $ sudo docker run -d -p 8081:80 --memory="256m" nginx
   $ sudo docker run -it --memory="1g" alpine /bin/bash
{% endhighlight %}

But with can too work with swap memory limitation using the --memory-swap option, following the exemple below we'll limit memory to 1026m and swap to 2g.

{% highlight ruby %}
   $ sudo docker run -d -p 8081:80 --memory="1024m" --memory-swap"2g" alpine
{% endhighlight %}



Working with contaimer cpu limit

{% highlight ruby %}
   $ sudo docker run -d -p 8081:80 --memory="1024m" --memory-swap"2g" --cpus=".7" alpine
{% endhighlight %}

Now our container can use 1025mb ( 1g ) memory, 2g of swap memory and 70000, if we prefer add limit of cpu shares that by default if 1024, increasing and decreasing it and allowing 
container to use a greater or lesser portion of host machine cpu cycles 
	

Conclusion

Check out the [docker-resource-limits][docker-resource-limits] official documentation about docker resource limits 

[docker-resource-limits]: https://docs.docker.com/config/containers/resource_constraints/
