name: sumomo
---

Sumomo is a powerful Ruby-based DSL that extends AWS CloudFormation and creates a nice framework from which you can easily describe  complex cloud topologies with code.

A simple deployable example

    network = make_network(layers: [:web, :db])
    
    eip = make "AWS::EC2::EIP"
    
    make_autoscaling_group(
        network: network,
        layers: :web,
        eip: eip,
        type: "c3.xlarge",
        vol_size: 15, # GB,
        script: <<-SCRIPT
            yum install git gcc g++
            echo "hello world" >> ~/hello
            # or maybe start apache or any service that the server will use
        SCRIPT
    )

    output "IPAddress", eip

- Can also be used to easily test and deploy APIs on AWS Lambda and AWS API Gateway
- Used personally to greatly streamline DevOps
