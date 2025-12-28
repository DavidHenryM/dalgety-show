import { List, ListItem, ListItemIcon, ListItemText, Stack } from "@mui/material";
import StarIcon from '@mui/icons-material/Star'

export function BulletList(props: {listItems: string[]}){
  return (
    <List>
      {
        props.listItems.map((listItem)=>{
          return (
            <ListItem sx={{ display: 'list-item', paddingLeft: 2 }}>
            <Stack direction="row">
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            <ListItemText>{listItem}</ListItemText>
            </Stack>
          </ListItem>
          )
        })
      }

    </List>
  )
}