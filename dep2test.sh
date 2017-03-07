#readme： sh dep2test.sh 添加任何参数则不会重新编译
project="h5app"
if [ -z $1 ]
then
	echo "****************开始gulp test ********************"
	rm -rf dist/
	gulp dev --project=$project
	echo "****************gulp test 结束********************"
fi

if cd dist
then
	expect -c "
		spawn scp -r . trade@100.73.128.2:/data/trade/h5/dst/$project/
		expect {
			\"*assword\" {set timeout 300; send \"trade@JDB123\r\";}
			\"yes/no\" {send \"yes\r\"; exp_continue;}
		}
		expect eof"
	echo "****************scp 结束 ********************"
	cd ../
	# spawn 直接执行scp dist/ 有问题，换做cd 进行 -r .
	#scp -r dist/* root@100.73.16.42:/data/dst/songzhongji/
else
	echo "fail！"
	exit 1
fi
