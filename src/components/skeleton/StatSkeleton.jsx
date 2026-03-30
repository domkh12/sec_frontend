import {Skeleton} from "@mui/material";

function StatSkeleton() {
    return(
            <Skeleton
                      variant="rounded"
                      sx={{
                          bgcolor: 'grey',
                          width: '100%',
                          height: '80.4px',
                          borderRadius: '12px',
                      }}
            />
    )

}
export default StatSkeleton;