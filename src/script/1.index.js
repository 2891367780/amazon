!function($){
        const $mainleft2_list=$('.render1')
        const $mainleft3_list=$('.mainleft3-list')
        $.ajax({
            url:'http://localhost/amazon/php/1.index.php',
            dataType: 'json'
        }).done(function(data){
            // console.log(data);
            // 渲染第一部分
            let $main1str=''
            $.each(data,function(index,value){
                // console.log(value);
                
                $main1str+=`
                <li>
                  <a href="" target="_blank">
                    <img
                      src="${value.url}"
                      alt=""
                    />
                    <span class="price">
                      <em>￥</em>
                      ${value.price}
                    </span>
                    <p>${value.title}</p>
                    <i>距结束</i>
                  </a>
                </li>
                `

                $mainleft2_list.html($main1str)
            })

            // 渲染第二第三部分
            let $main2str=''
            $.each(data,function(index,value){
                // console.log(value);
                if(index<5){

               
                $main2str+=`
                <li>
                  <a href="" target="_blank">
                    <img
                      src="${value.url}"
                      alt=""
                    />
                    <span class="price">
                      <em>￥</em>
                      ${value.price}
                    </span>
                    
                  </a>
                </li>
                `
                
            }
                $mainleft3_list.html($main2str)
            })

            
        })
}(jQuery)