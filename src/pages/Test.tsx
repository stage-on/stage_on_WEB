import axios from "axios";

export default function Test(){
    const onTest =async()=>{
       
        try{
            const res = await axios.get('http://stage-on.duckdns.org:8080/api/v1/likes/my/concerts?userId=1')
            if (res.status===200){
                 console.log("통신 성공");
            }           
        } catch(error){
            console.log(error);
        }
    }
    return <div><button onClick={onTest}>테스트</button></div>
}