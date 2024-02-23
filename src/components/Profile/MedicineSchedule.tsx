import React, { ReactElement } from "react";
import { Calendar } from "antd";
import { Modal } from "react-bootstrap";
import "./medicineSchedule.scss";
import moment from "moment";
import usePromise from "utils/usePromise";
import { getScheduleOfDate } from "utils/schedule";

interface Props {
  patientAccountId: number;
}

function MedicineSchedule(props: Props): ReactElement {
  const { patientAccountId } = props;
  const [medicineSchedule] = usePromise<Record<string, unknown>[]>(`/user/schedules/${patientAccountId}`);

  function getClearDate(date: Date) {
    const clearDate = new Date(date);
    clearDate.setHours(0, 0, 0, 0);
    return clearDate;
  }

  function dateCellRender(value: moment.Moment) {
    if (!medicineSchedule) return;
    const date = new Date(value.toISOString());
    const schedules = getScheduleOfDate(date, medicineSchedule ?? []);
    const dateSelected = selectDate ? new Date(selectDate.toISOString()) : undefined;
    const selected = (dateSelected && getClearDate(dateSelected).getTime() === getClearDate(date).getTime()) ?? false;

    return <MedicineScheduleItem unselect={unselect} selected={selected} schedule={schedules} value={value} />;
  }

  const [selectDate, setSelectDate] = React.useState<moment.Moment | null>(null);
  function onSelect(value: moment.Moment) {
    setSelectDate(value);
  }
  function unselect() {
    setTimeout(() => {
      setSelectDate(null);
    }, 100);
  }

  return (
    <div className="customSchedule">
      <Calendar onSelect={onSelect} dateCellRender={dateCellRender} />
    </div>
  );
}

function MedicineScheduleItem({ schedule, selected, unselect, value }: { value: any; unselect: any; selected: boolean; schedule: any }) {
  const scheduleSet = new Set<string>();
  schedule.forEach((s: any) => {
    if (s?.type === "medicine_prescription") scheduleSet.add(s?.medicinePrescription?.medicine);
  });
  return (
    <div className="medicineScheduleItem">
      <Modal show={selected} onHide={unselect} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Lịch ngày {new Date(value).getDate()}/ {new Date(value).getMonth() + 1}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="medicineScheduleItemBody">
            <ul className="dateCellData p-2">
              {schedule?.map((sche: any) => (
                <li key={sche.id}>
                  {sche.type === "medicine_prescription" && (
                    <>
                      <div>
                        <b>Thuốc {sche?.medicinePrescription?.medicine}</b>
                      </div>
                      <div>
                        Giờ uống thuốc: &nbsp;
                        <span>{moment(new Date(sche?.time)).format("HH:mm")}</span>
                      </div>
                      {sche?.medicinePrescription?.note != "" && sche?.medicinePrescription?.note != null && (
                        <div>
                          Ghi chú: <i> {sche?.medicinePrescription?.note}</i>
                        </div>
                      )}
                    </>
                  )}
                  {sche.type === "appointment" && (
                    <>
                      <div style={{ fontSize: "18px" }}>
                        <b>{sche?.appointment?.name}</b>
                      </div>
                      <div>
                        Thời gian: &nbsp;
                        <span>{moment(new Date(sche?.time)).format("HH:mm")}</span>
                      </div>
                      <div>
                        Thời lượng: <span> {sche?.appointment?.duration} phút</span>
                      </div>
                      <div>
                        Link:{" "}
                        <a href={sche?.appointment?.link} target="_blank" rel="noreferrer">
                          {sche?.appointment?.link}
                        </a>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
      <ul className="dateCellData">
        {Array.from(scheduleSet)
          .concat(schedule.filter((s: any) => s?.type === "appointment").map((s: any) => s?.appointment.name))
          .map((sche: any, i: number) => (
            <li key={i}>{sche}</li>
          ))}
      </ul>
    </div>
  );
}

export default MedicineSchedule;
