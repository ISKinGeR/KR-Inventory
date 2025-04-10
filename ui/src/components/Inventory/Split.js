import React, { useEffect, useState } from 'react';
import { TextField, ButtonGroup, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import Nui from '../../util/Nui';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: 25,
	},
	input: {
		width: '100%',
		height: '100%',
	},
	quickActions: {
		minWidth: '10vw',
		textAlign: 'center',
	},
	btn: {
		background: `${theme.palette.secondary.light}60`,
		color: theme.palette.success.main,
		transition: 'background ease-in 0.15s',
		'&:hover': {
			background: 'rgb(10, 10, 27)',
		},
	},
}));

export default React.forwardRef((props, ref) => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [val, setVal] = useState(props.data.item.Count);

	useEffect(() => {
		return () => {
			setVal(0);
		};
	}, []);

	const onChange = (e) => {
		setVal(
			e.target.value > props.data.item.Count
				? Math.max(1, Math.min(props.data.item.Count, 10000))
				: Math.max(1, Math.min(Math.floor(e.target.value), 10000)),
		);
	};

	const drag = (e, v = null) => {
		dispatch({
			type: 'SET_HOVER',
			payload: {
				slot: props.data.item.Slot,
				owner: props.data.owner,
				shop: props.data.shop,
				invType: props.data.invType,
				...props.data.item,
				Count: Math.floor(Boolean(v) ? v : val),
			},
		});
		dispatch({
			type: 'SET_HOVER_ORIGIN',
			payload: {
				slot: props.data.item.Slot,
				owner: props.data.owner,
				shop: props.data.shop,
				invType: props.data.invType,
				class: props.data.vehClass,
				model: props.data.vehModel,
				...props.data.item,
			},
		});
		dispatch({
			type: 'SET_SPLIT_ITEM',
			payload: null,
		});
	};

	const Giveitem = (e, v = null) => {
		const inputVal = Math.floor(Boolean(v) ? v : val);
		const itemCount = props.data.item.Count;
	
		const isSplit = inputVal !== itemCount;
		const countTo = isSplit ? inputVal : itemCount;
	
		const [ownerFromStr, invTypeFromStr] = String(props.data.item.Owner).split('-');
		const ownerFrom = parseInt(ownerFromStr);
		const invTypeFrom = parseInt(invTypeFromStr);
		Nui.send('GiveItemAction', {
			slotFrom: props.data.item.Slot,
			countFrom: itemCount,
			name: props.data.item.Name,
			ownerFrom: ownerFrom,
			invTypeFrom: invTypeFrom,
			isSplit: isSplit,
			countTo: countTo,
			vehModelTo: false,
			vehClassFrom: false,
			vehModelFrom: false,
			vehClassTo: false
		});
	};

	return (
		<div className={classes.wrapper}>
			{props.data.item.Count > 1 && (
				<>
					<div className={classes.inputWrap}>
						<TextField
							className={classes.input}
							label="Amount"
							type="number"
							value={val}
							inputProps={{
								min: 0,
								max:
									props.data.item.Count > 10000
										? 10000
										: props.data.item.Count,
							}}
							onChange={onChange}
						/>
					</div>
					<div className={classes.quickActions}>
						<ButtonGroup variant="contained" color="secondary">
							<Button
								className={classes.btn}
								onClick={() => setVal(1)}
							>
								Single
							</Button>
							<Button
								className={classes.btn}
								onClick={() =>
									setVal(
										Math.max(
											1,
											Math.min(Math.floor(props.data.item.Count / 4), 10000),
										)
									)
								}
							>
								1/4
							</Button>
							<Button
								className={classes.btn}
								onClick={() =>
									setVal(
										Math.max(
											1,
											Math.min(Math.floor(props.data.item.Count / 2), 10000),
										)
									)
								}
							>
								1/2
							</Button>
							<Button
								className={classes.btn}
								onClick={() =>
									setVal(
										Math.max(
											1,
											Math.min(props.data.item.Count, 10000),
										)
									)
								}
							>
								Max
							</Button>
						</ButtonGroup>
					</div>
				</>
			)}
	
			<div 
				className={classes.quickActions}
				style={props.data.item.Count > 1 ? { marginTop: 10 } : {}}
			>
				<ButtonGroup
					fullWidth
					size="large"
					variant="contained"
					color="primary"
				>
					<Button className={classes.btn} onClick={drag}>
						Move
					</Button>
				</ButtonGroup>
			</div>
	
			{props.data.isPlayerInventory && (
				<div className={classes.quickActions}
				style={props.data.item.Count >= 1 ? { marginTop: 10 } : {}}
				>
					<ButtonGroup
						fullWidth
						size="large"
						variant="contained"
						color="primary"
					>
						<Button className={classes.btn} onClick={Giveitem}>
							Give
						</Button>
					</ButtonGroup>
				</div>
			)}
		</div>
	);
	
});