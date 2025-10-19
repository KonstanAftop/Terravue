import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Checkbox,
  Box,
  Typography,
} from '@mui/material'
import { Visibility, Edit, Delete } from '@mui/icons-material'
import { LandParcel } from '@terravue/shared'

interface LandListProps {
  lands: LandParcel[]
  selectedLands: string[]
  onToggleSelection: (id: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
  onViewDetails?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const LandList = ({
  lands,
  selectedLands,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onViewDetails,
  onEdit,
  onDelete,
}: LandListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified'
      case 'pending':
        return 'Pending'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }

  const allSelected = lands.length > 0 && selectedLands.length === lands.length

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={allSelected}
                indeterminate={selectedLands.length > 0 && !allSelected}
                onChange={() => (allSelected ? onClearSelection() : onSelectAll())}
              />
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Land Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Area (ha)
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Land Type
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Status
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Carbon Potential
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Date Added
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="subtitle2" fontWeight={600}>
                Actions
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  No land parcels registered yet
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            lands.map((land) => (
              <TableRow
                key={land.id}
                hover
                selected={selectedLands.includes(land.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedLands.includes(land.id)}
                    onChange={() => onToggleSelection(land.id)}
                  />
                </TableCell>
                <TableCell>{land.name}</TableCell>
                <TableCell>{land.area.toFixed(2)}</TableCell>
                <TableCell>{land.landType}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(land.verificationStatus)}
                    color={getStatusColor(land.verificationStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{land.carbonPotential.toLocaleString('en-US')} credits/year</TableCell>
                <TableCell>
                  {new Date(land.createdAt).toLocaleDateString('en-US')}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {onViewDetails && (
                      <IconButton
                        size="small"
                        onClick={() => onViewDetails(land.id)}
                        title="View Details"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    )}
                    {onEdit && (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(land.id)}
                        title="Edit"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        size="small"
                        onClick={() => onDelete(land.id)}
                        title="Delete"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

