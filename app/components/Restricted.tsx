import { useUserRole } from "../lib/queryHooks"
import UnAuthorised from "./UnAuthorised"
import Waiting from "./Waiting"

export default function RestrictedAccess(props: {children: React.ReactNode, explicit: boolean}){
    const [role, roleLoading] = useUserRole()
      if (roleLoading){
        if(props.explicit){
          return (
            <Waiting message="Authorising..." open={roleLoading}/>
          )
        } else {
          return (<></>)
        }
    } else {
      if (role === "SITE_ADMIN" || role === "OWNER"){
        return (
          <>{props.children}</>
        )
      } else {
        if (props.explicit){
          return (<UnAuthorised/>)
        } else {
          return (<></>)
        }
      }
    }
} 