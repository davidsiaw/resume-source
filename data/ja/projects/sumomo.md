name: sumomo
---

**※本ウェブサイトはこのツールを利用して作りました。**

Sumomoはクラウドシステム配備を簡単にする高機能Ruby DSLです。

Sumomoの使用例:

    # このプログラムは簡単にVPC,Subnet,Gatewayを準備して、その中にEIPとEC2を作ります。

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
            # サーバーのスタータップスクリプトなどはここで
        SCRIPT
    )

    output "IPAddress", eip

- AWS API GatewayとAWS LambdaにAPIの作りやテスティングや配備も可能です
- 個人ウェブサイトに使っております
