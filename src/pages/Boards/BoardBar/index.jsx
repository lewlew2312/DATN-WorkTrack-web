import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%', height: (theme) => theme.worktrackCustom.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      borderBottom: '1px solid white'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="Work Track Board"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon/>}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}
        >
          <Tooltip title="Tien Pham">
            <Avatar
              alt="Tien Pham"
              src="https://scontent.fhan2-5.fna.fbcdn.net/v/t1.6435-9/149210855_102265685243385_2941609226173097761_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=s5568rS4kSIQ7kNvwHLnvgp&_nc_oc=AdoRp_tO7En-GGdVhngsoE8xWF-sJPj8gy2RQZt7zsb5S3xoM8yCfm01Ih9MS5WjX4Y&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=G67bK1yREP_ubM4rehZq0g&_nc_ss=7a32e&oh=00_AfwwdObwmTExtcBQ_jd9xKln6Kaat1lFfOAD88Pq2IK1NQ&oe=69E99889"
            />
          </Tooltip>
          <Tooltip title="Tien Pham">
            <Avatar
              alt="Tien Pham"
              src="https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/481295918_2048698705613865_1699070760864949047_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=107&ccb=1-7&_nc_sid=2a1932&_nc_ohc=NnMkdVGelT0Q7kNvwFSYDWk&_nc_oc=AdqGQWEaCR6adnRdvAljTM2dheT_TuqvEvmXKy6jXIRsEYLN5a6WsK0uF1zCOcuzZMs&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=mSgm-DMxJzUJVhITsDA2zA&_nc_ss=7a32e&oh=00_Afy0X-M9vCHE6VDkgG50-HkpxdPsdvBwKkRB0BQIKWl8QA&oe=69C83DCF"
            />
          </Tooltip>
          <Tooltip title="Tien Pham">
            <Avatar
              alt="Tien Pham"
              src="https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-1/484641391_1822816155207265_1119271269615345617_n.jpg?stp=c0.18.540.540a_dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=1d2534&_nc_ohc=MyKMvZr8U0YQ7kNvwFJs61h&_nc_oc=AdqfrRMXSqH1iw8KFRPkReAUt0bgrFqF9t4OKJsfjprC8SBYHkvkHkG0rTt7hLiTZPw&_nc_zt=24&_nc_ht=scontent.fhan20-1.fna&_nc_gid=zxTtfiHVMU9EwWMB_4RRBw&_nc_ss=7a32e&oh=00_AfzuTBzybLVW1H_2NRVp_8gzAVDja8J91-9jvsfrv7KvtQ&oe=69C835D8"
            />
          </Tooltip>
          <Tooltip title="Tien Pham">
            <Avatar
              alt="Tien Pham"
              src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/481920529_2354852448221018_7832452323644489368_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2a1932&_nc_ohc=AqRWjndsW7cQ7kNvwFpM-X-&_nc_oc=AdodN_FaYx0sdNspeFwwgAQdEXaTcGt7azWUxHv5BxY5pnKL1QE0D9DJJkJPlOyibB0&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=utB1dE9MklIq5nIY3-JjsA&_nc_ss=7a32e&oh=00_Afyv74i8baqejb1e3N4s_0ItWZLJVvKmWvr9cD0Qv7GSAg&oe=69C8166E"
            />
          </Tooltip>
          <Tooltip title="Tien Pham">
            <Avatar
              alt="Tien Pham"
              src="https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-1/484641391_1822816155207265_1119271269615345617_n.jpg?stp=c0.18.540.540a_dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=1d2534&_nc_ohc=MyKMvZr8U0YQ7kNvwFJs61h&_nc_oc=AdqfrRMXSqH1iw8KFRPkReAUt0bgrFqF9t4OKJsfjprC8SBYHkvkHkG0rTt7hLiTZPw&_nc_zt=24&_nc_ht=scontent.fhan20-1.fna&_nc_gid=zxTtfiHVMU9EwWMB_4RRBw&_nc_ss=7a32e&oh=00_AfzuTBzybLVW1H_2NRVp_8gzAVDja8J91-9jvsfrv7KvtQ&oe=69C835D8"
            />
          </Tooltip>
          <Tooltip title="Tien Pham">
            <Avatar
              alt="Tien Pham"
              src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/481920529_2354852448221018_7832452323644489368_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2a1932&_nc_ohc=AqRWjndsW7cQ7kNvwFpM-X-&_nc_oc=AdodN_FaYx0sdNspeFwwgAQdEXaTcGt7azWUxHv5BxY5pnKL1QE0D9DJJkJPlOyibB0&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=utB1dE9MklIq5nIY3-JjsA&_nc_ss=7a32e&oh=00_Afyv74i8baqejb1e3N4s_0ItWZLJVvKmWvr9cD0Qv7GSAg&oe=69C8166E"
            />
          </Tooltip>
          <Tooltip title="Tien Pham">
            <Avatar
              alt="Tien Pham"
              src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/481920529_2354852448221018_7832452323644489368_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2a1932&_nc_ohc=AqRWjndsW7cQ7kNvwFpM-X-&_nc_oc=AdodN_FaYx0sdNspeFwwgAQdEXaTcGt7azWUxHv5BxY5pnKL1QE0D9DJJkJPlOyibB0&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=utB1dE9MklIq5nIY3-JjsA&_nc_ss=7a32e&oh=00_Afyv74i8baqejb1e3N4s_0ItWZLJVvKmWvr9cD0Qv7GSAg&oe=69C8166E"
            />
          </Tooltip>
          <Tooltip title="Tien Pham">
            <Avatar
              alt="Tien Pham"
              src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/481920529_2354852448221018_7832452323644489368_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2a1932&_nc_ohc=AqRWjndsW7cQ7kNvwFpM-X-&_nc_oc=AdodN_FaYx0sdNspeFwwgAQdEXaTcGt7azWUxHv5BxY5pnKL1QE0D9DJJkJPlOyibB0&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=utB1dE9MklIq5nIY3-JjsA&_nc_ss=7a32e&oh=00_Afyv74i8baqejb1e3N4s_0ItWZLJVvKmWvr9cD0Qv7GSAg&oe=69C8166E"
            />
          </Tooltip>
          <Tooltip title="Tien Pham">
            <Avatar
              alt="Tien Pham"
              src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/481920529_2354852448221018_7832452323644489368_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2a1932&_nc_ohc=AqRWjndsW7cQ7kNvwFpM-X-&_nc_oc=AdodN_FaYx0sdNspeFwwgAQdEXaTcGt7azWUxHv5BxY5pnKL1QE0D9DJJkJPlOyibB0&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=utB1dE9MklIq5nIY3-JjsA&_nc_ss=7a32e&oh=00_Afyv74i8baqejb1e3N4s_0ItWZLJVvKmWvr9cD0Qv7GSAg&oe=69C8166E"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
