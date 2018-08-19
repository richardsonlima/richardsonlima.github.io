---
layout: post
title:  "Configuring a Kubernetes HA Cluster with AWS VPC using Kops"
date:   2018-06-20 00:11:14
categories: kops
tags: kops
image: /assets/article_images/2018-06-20-ha-k8s-cluster-with-aws-vpc-using-kops/justin-campbell-706421--unsplash.jpg
---


TL;DR It should be the first post in a series of Kops. So the intention of this post is to provide a guide   to setting up a prod ready k8s on AWS using [Kops][kops-official-repo] , you need to know that exists lots of options to accomplish this using tools like techtonic, stackpoing, etc. But Kops seems to have gained a lot of traction and it's an awesome FOSS project.

  Prereq:
In order to follow along with this guide, you need a couple of tools and an AWS account.
- An AWS programmatic access and `aws cli tool`;
- `Kops` installed on machine (latest version);
- `kubectl`


You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve --watch`, which launches a web server and auto-regenerates your site when a file is updated.

To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.ext` and includes the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

{% highlight bash %}
$ aws ec2 create-vpc \
--cidr-block 10.0.0.0/16 \
--region eu-west-1 { "Vpc": { "VpcId": "vpc-a55e77c1", "InstanceTenancy": "default", "Tags": [], "State": "pending", "DhcpOptionsId": "dopt-b8ee9cdd", "CidrBlock": "10.0.0.0/16", "IsDefault": false } }
{% endhighlight %}

Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll’s dedicated Help repository][jekyll-help].

{% highlight bash %}

$ aws ec2 modify-vpc-attribute \
--vpc-id <VPC_ID> \
--enable-dns-hostnames "{\"Value\":true}" \
--region eu-west-1
{% endhighlight %}

{% highlight bash %}

$ aws ec2 create-internet-gateway \
--region eu-west-1
{% endhighlight %}

[kops-official-repo]: https://github.com/kubernetes/kops
